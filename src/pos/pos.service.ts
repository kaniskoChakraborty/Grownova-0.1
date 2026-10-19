import { randomUUID } from 'crypto';
import { BadRequestException, ForbiddenException, HttpException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod, PosOrderStatus, Prisma, StockMovementType, SyncConflictStatus, SyncConflictType, UpiCallbackResult } from '../../generated/prisma/client';
import { financialYear } from '../crm/irn';
import { EWB_THRESHOLD, ewbValidUntil, mockEwbNo, vehicleNo } from '../gst/ewaybill';
import { InventoryService } from '../inventory/inventory.service';
import { istPeriod } from '../inventory/stock';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import {
  CancelPosOrderDto, CreatePosOrderDto, EwayBillDto, ListConflictsQuery, ListPosOrdersQuery, PosSyncDto, ReconciliationQuery, ResolveConflictDto, SendReceiptDto, SimulateUpiPaymentDto,
} from './dto/pos.dto';
import { Shortfall, priceChanges, soldAtProblem } from './sync';
import { receiptLines, textPdf } from './receipt';
import { UpiCallback, callbackSignature, matchResult, mockUtr, newTxnRef, upiLink, validSignature } from './upi';

const DETAIL = {
  location: { select: { name: true } },
  lines: { include: { variant: { select: { sku: true, name: true, product: { select: { name: true, unit: true } } } } } },
};

@Injectable()
export class PosService {
  private readonly logger = new Logger(PosService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
    private readonly realtime: RealtimeGateway,
    private readonly config: ConfigService,
  ) {}

  // Rings up a sale: the order, its lines and the stock OUT (FEFO, never below 0) commit together or not at all.
  // A repeated Idempotency-Key returns the first order instead of selling twice (a retry after a dropped
  // connection, a double tap). Two requests racing with the same key: the second hits the unique index and gets the first.
  // ponytail: a reused key with a different body still returns the first order; compare bodies if clients misuse keys.
  async create(businessId: string, dto: CreatePosOrderDto, actorId: string, idempotencyKey?: string) {
    return (await this.book(businessId, dto, actorId, idempotencyKey)).order;
  }

  // create() plus the offline-sync options: soldAt backdates the order (and picks its financial year), and
  // allowShort books the full sale but deducts only the stock there is, reporting the rest as shortfalls.
  private async book(businessId: string, dto: CreatePosOrderDto, actorId: string, idempotencyKey?: string, opts: { soldAt?: Date; allowShort?: boolean } = {}) {
    const shortfalls: Shortfall[] = [];
    if (idempotencyKey) {
      const done = await this.byKey(businessId, idempotencyKey);
      if (done) return { order: done, shortfalls, replay: true };
    }
    const [location, variants] = await Promise.all([
      this.inventory.activeLocation(businessId, dto.locationId),
      Promise.all(dto.items.map((i) => this.inventory.activeVariant(businessId, i.variantId))),
    ]);
    // Stock rows are locked in variant id order, the same order transfers use, so two sales can't deadlock.
    const lines = dto.items
      .map((item, i) => {
        const quantity = new Prisma.Decimal(item.quantity);
        const unitPrice = new Prisma.Decimal(item.unitPrice ?? variants[i].salePrice);
        return { variant: variants[i], quantity, unitPrice, lineTotal: quantity.times(unitPrice).toDecimalPlaces(2) };
      })
      .sort((a, b) => (a.variant.id < b.variant.id ? -1 : 1));
    const total = lines.reduce((sum, l) => sum.plus(l.lineTotal), new Prisma.Decimal(0));
    const paid = dto.paymentMethod !== PaymentMethod.UPI;
    const soldAt = opts.soldAt ?? new Date();
    const fy = financialYear(soldAt);

    let created;
    try {
      created = await this.prisma.$transaction(async (tx) => {
        // Same per-year counter as invoices, own series. ponytail: the counter row lock serialises one business's
        // sales; fine for a shop's tills, shard the series per location if it ever queues.
        const { last } = await tx.invoiceCounter.upsert({
          where: { businessId_series_fy: { businessId, series: 'POS', fy } },
          create: { businessId, series: 'POS', fy, last: 1 },
          update: { last: { increment: 1 } },
        });
        const order = await tx.posOrder.create({
          data: {
            businessId, locationId: location.id, number: `POS/${fy.slice(2)}/${String(last).padStart(6, '0')}`,
            status: paid ? PosOrderStatus.PAID : PosOrderStatus.PENDING_PAYMENT, paidAt: paid ? soldAt : null, createdAt: soldAt,
            paymentMethod: dto.paymentMethod, total, customerName: dto.customerName, customerPhone: dto.customerPhone,
            idempotencyKey, createdById: actorId,
            lines: { create: lines.map(({ variant, quantity, unitPrice, lineTotal }) => ({ variantId: variant.id, quantity, unitPrice, lineTotal })) },
          },
        });
        const moved = [];
        for (const { variant, quantity } of lines) {
          const entry = { businessId, actorId, unitCost: variant.costPrice, reference: order.number, note: 'POS sale', posOrderId: order.id };
          let take = quantity;
          if (opts.allowShort) {
            const { quantity: have } = await this.inventory.lockLevel(tx, businessId, variant.id, location.id);
            take = Prisma.Decimal.min(quantity, Prisma.Decimal.max(have, 0));
            if (take.lt(quantity)) shortfalls.push({ variantId: variant.id, sku: variant.sku, sold: quantity, deducted: take, short: quantity.minus(take) });
          }
          if (take.gt(0)) moved.push({ variant, rows: await this.inventory.applyMovement(tx, variant, location, StockMovementType.OUT, take, null, entry) });
        }
        return { order, moved };
      });
    } catch (e) {
      if (idempotencyKey && (e as { code?: string }).code === 'P2002') {
        const done = await this.byKey(businessId, idempotencyKey);
        if (done) return { order: done, shortfalls: [], replay: true };
      }
      throw e;
    }
    for (const { variant, rows } of created.moved) await this.inventory.alert(businessId, variant, rows);
    const order = await this.findOne(businessId, created.order.id);
    this.realtime.emitToBusiness(businessId, 'pos.order_created', order);
    return { order, shortfalls, replay: false };
  }

  // Uploads sales a till made while offline, oldest first. Auto-merge rules:
  //  - already synced (same device + clientId): DUPLICATE, nothing changes;
  //  - offline price differs from today's sale price: the offline price stands (the customer paid it), logged as PRICE_CHANGED;
  //  - not enough stock left: the sale is booked in full (the goods are gone), only the stock there is gets deducted,
  //    and a STOCK_SHORT conflict stays OPEN until someone recounts;
  //  - anything that can't be booked (archived item or shop, bad data): REJECTED, kept OPEN with the original sale.
  // ponytail: stock ledger rows carry the sync time, not soldAt, so ledger balances stay in order; only the order is backdated.
  async sync(businessId: string, dto: PosSyncDto, actorId: string) {
    const results = [];
    for (const sale of [...dto.orders].sort((a, b) => a.soldAt.localeCompare(b.soldAt))) {
      const { clientId, soldAt, ...order } = sale;
      const base = { businessId, deviceId: dto.deviceId, clientId };
      const when = new Date(soldAt);
      const late = soldAtProblem(when);
      try {
        if (late) throw new BadRequestException(late);
        const booked = await this.book(businessId, order, actorId, `offline:${dto.deviceId}:${clientId}`, { soldAt: when, allowShort: true });
        if (booked.replay) {
          results.push({ clientId, result: 'DUPLICATE', orderId: booked.order.id, number: booked.order.number, conflicts: [] });
          continue;
        }
        const current = await this.prisma.productVariant.findMany({ where: { id: { in: order.items.map((i) => i.variantId) } }, select: { id: true, salePrice: true } });
        const data = [
          ...priceChanges(booked.order.lines, current).map((detail) => ({ ...base, orderId: booked.order.id, type: SyncConflictType.PRICE_CHANGED, status: SyncConflictStatus.AUTO_RESOLVED, detail })),
          ...booked.shortfalls.map((s) => ({ ...base, orderId: booked.order.id, type: SyncConflictType.STOCK_SHORT, status: SyncConflictStatus.OPEN, detail: { ...s, sold: s.sold.toString(), deducted: s.deducted.toString(), short: s.short.toString() } })),
        ];
        const conflicts = await this.prisma.$transaction(data.map((d) => this.prisma.posSyncConflict.create({ data: d })));
        results.push({ clientId, result: conflicts.length ? 'MERGED' : 'ACCEPTED', orderId: booked.order.id, number: booked.order.number, conflicts });
      } catch (e) {
        if (!(e instanceof HttpException) || e.getStatus() >= 500) throw e;
        // A till retrying a sale that still can't be booked gets its earlier rejection back, not a new one each time.
        const conflict = (await this.prisma.posSyncConflict.findFirst({ where: { ...base, type: SyncConflictType.REJECTED } })) ?? await this.prisma.posSyncConflict.create({
          data: { ...base, type: SyncConflictType.REJECTED, status: SyncConflictStatus.OPEN, detail: { error: e.message, sale: { ...sale } } as unknown as Prisma.InputJsonValue },
        });
        results.push({ clientId, result: 'REJECTED', error: e.message, conflicts: [conflict] });
      }
    }
    const open = results.filter((r) => r.conflicts.some((c) => c.status === SyncConflictStatus.OPEN)).length;
    if (open) this.realtime.emitToBusiness(businessId, 'pos.sync_conflicts', { deviceId: dto.deviceId, open });
    return { deviceId: dto.deviceId, results };
  }

  findConflicts(businessId: string, { status }: ListConflictsQuery) {
    return this.prisma.posSyncConflict.findMany({ where: { businessId, status }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  // A person has dealt with an OPEN conflict (recounted the stock, re-entered a rejected sale) and says so.
  async resolveConflict(businessId: string, id: string, dto: ResolveConflictDto, actorId: string) {
    const { count } = await this.prisma.posSyncConflict.updateMany({
      where: { id, businessId, status: SyncConflictStatus.OPEN },
      data: { status: SyncConflictStatus.RESOLVED, resolvedById: actorId, resolvedAt: new Date(), note: dto.note },
    });
    if (!count) throw new NotFoundException('No open conflict with that id');
    return this.prisma.posSyncConflict.findUniqueOrThrow({ where: { id } });
  }

  findAll(businessId: string, { status, locationId }: ListPosOrdersQuery) {
    return this.prisma.posOrder.findMany({
      where: { businessId, status, locationId },
      orderBy: { createdAt: 'desc' },
      include: DETAIL,
      take: 100, // ponytail: fixed cap, add paging with the day-end report
    });
  }

  async findOne(businessId: string, id: string) {
    const order = await this.prisma.posOrder.findFirst({ where: { id, businessId }, include: DETAIL });
    if (!order) throw new NotFoundException('POS order not found');
    return order;
  }

  // Voids a sale and puts every unit back into the batch and location it came from, at the cost it left with.
  // ponytail: a cancelled PAID order means money is owed back; the refund itself happens at the counter, not here.
  async cancel(businessId: string, id: string, dto: CancelPosOrderDto, actorId: string) {
    const order = await this.findOne(businessId, id);
    await this.prisma.$transaction(async (tx) => {
      // The status filter row-locks the order, so two cancels can't both return the stock.
      const { count } = await tx.posOrder.updateMany({
        where: { id, status: { not: PosOrderStatus.CANCELLED } },
        data: { status: PosOrderStatus.CANCELLED, cancelledAt: new Date(), cancelReason: dto.reason },
      });
      if (!count) throw new BadRequestException(`${order.number} is already cancelled`);
      const sold = await tx.stockLedgerEntry.findMany({
        where: { posOrderId: id, type: StockMovementType.OUT },
        include: { batch: { select: { id: true, batchNo: true } }, location: true, variant: { include: { product: { select: { unit: true } } } } },
        orderBy: { variantId: 'asc' },
      });
      for (const row of sold) {
        const entry = { businessId, actorId, unitCost: row.unitCost, reference: order.number, note: 'POS cancel', posOrderId: id };
        await this.inventory.applyMovement(tx, row.variant, row.location, StockMovementType.IN, row.quantity.neg(), row.batch, entry);
      }
    });
    return this.findOne(businessId, id);
  }

  // Mock GSTN e-way bill for goods leaving on a vehicle. One per order: asking again returns the same bill.
  // ponytail: no cancel or Part-B vehicle change yet; add both with the real NIC e-way bill API.
  async ewayBill(businessId: string, id: string, dto: EwayBillDto) {
    const [order, business] = await Promise.all([this.findOne(businessId, id), this.prisma.business.findUniqueOrThrow({ where: { id: businessId } })]);
    if (order.ewbNo) return order;
    if (order.status !== PosOrderStatus.PAID) throw new BadRequestException(`${order.number} is ${order.status}; only paid orders can be dispatched`);
    if (!business.gstin) throw new BadRequestException('Set the business GSTIN first (PATCH /businesses/{id})');
    const vehicle = vehicleNo(dto.vehicleNo);
    if (!vehicle) throw new BadRequestException('vehicleNo must look like DL01AB1234');
    const variants = await this.prisma.productVariant.findMany({ where: { id: { in: order.lines.map((l) => l.variantId) } }, select: { id: true, product: { select: { hsnCode: true } } } });
    const hsn = new Map(variants.map((v) => [v.id, v.product.hsnCode]));
    const missing = order.lines.filter((l) => !hsn.get(l.variantId)).map((l) => l.variant.sku);
    if (missing.length) throw new BadRequestException(`Set an HSN code on ${missing.join(', ')} first (PATCH /inventory/products/{id})`);

    const now = new Date();
    const ewb = {
      from: { gstin: business.gstin, name: business.name, place: [order.location.name, business.city].filter(Boolean).join(', ') },
      to: { gstin: dto.toGstin ?? 'URP', name: dto.toName, place: dto.toPlace, pincode: dto.toPincode },
      transport: { mode: 'ROAD', vehicleNo: vehicle, distanceKm: dto.distanceKm },
      items: order.lines.map((l) => ({ hsn: hsn.get(l.variantId), name: l.variant.product.name, quantity: l.quantity.toString(), unit: l.variant.product.unit, value: l.lineTotal.toString() })),
      total: order.total.toString(),
      requiredByLaw: order.total.gt(EWB_THRESHOLD),
    };
    // ewbNo: null makes two racing requests write once; the loser reads the winner's bill.
    await this.prisma.posOrder.updateMany({
      where: { id, ewbNo: null },
      data: { ewbNo: mockEwbNo(business.gstin, order.number), ewbDate: now, ewbValidUntil: ewbValidUntil(now, dto.distanceKm), ewb },
    });
    return this.findOne(businessId, id);
  }

  // The UPI link (draw it as a QR) for a pending UPI order. Calling it again returns the same reference.
  async upiLink(businessId: string, id: string) {
    const order = await this.findOne(businessId, id);
    if (order.paymentMethod !== PaymentMethod.UPI || order.status !== PosOrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(`${order.number} is not a UPI order waiting for payment`);
    }
    const business = await this.prisma.business.findUniqueOrThrow({ where: { id: businessId }, select: { name: true, upiId: true } });
    if (!business.upiId) throw new BadRequestException('Add your UPI ID to the business (PATCH /businesses/:id with upiId) first');
    // The null filter keeps two tills asking at once from each writing a different reference.
    await this.prisma.posOrder.updateMany({ where: { id, upiTxnRef: null }, data: { upiTxnRef: newTxnRef() } });
    const { upiTxnRef } = await this.prisma.posOrder.findUniqueOrThrow({ where: { id }, select: { upiTxnRef: true } });
    const amount = order.total.toFixed(2);
    return {
      orderId: id, number: order.number, txnRef: upiTxnRef!, amount, vpa: business.upiId,
      upiLink: upiLink({ vpa: business.upiId, payee: business.name, amount, txnRef: upiTxnRef!, note: order.number }),
    };
  }

  // The provider's payment callback. Every callback is stored, matched or not, for reconciliation;
  // a repeat with the same UTR (providers retry) returns the stored one and changes nothing.
  async upiCallback(cb: UpiCallback & { payerVpa?: string }, signature?: string) {
    if (!validSignature(this.config.get<string>('upi.webhookSecret')!, cb, signature)) throw new UnauthorizedException('Bad UPI signature');
    const seen = await this.prisma.upiPayment.findUnique({ where: { utr: cb.utr } });
    if (seen) return seen;
    let payment;
    try {
      payment = await this.prisma.$transaction(async (tx) => {
        const order = await tx.posOrder.findUnique({ where: { upiTxnRef: cb.txnRef } });
        let result = matchResult(order, cb);
        if (result === UpiCallbackResult.MATCHED) {
          // Status filter: an order cancelled a moment ago stays cancelled and the money shows up as an exception.
          const { count } = await tx.posOrder.updateMany({
            where: { id: order!.id, status: PosOrderStatus.PENDING_PAYMENT },
            data: { status: PosOrderStatus.PAID, paidAt: new Date() },
          });
          if (!count) result = UpiCallbackResult.ORDER_NOT_PENDING;
        }
        return tx.upiPayment.create({
          data: { businessId: order?.businessId, orderId: order?.id, txnRef: cb.txnRef, utr: cb.utr, amount: cb.amount, status: cb.status, payerVpa: cb.payerVpa, result },
        });
      });
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') return this.prisma.upiPayment.findUniqueOrThrow({ where: { utr: cb.utr } });
      throw e;
    }
    // ponytail: UNKNOWN_REF callbacks belong to no business, so no tenant sees them; match on payee VPA if that matters.
    if (payment.businessId) this.realtime.emitToBusiness(payment.businessId, 'pos.upi_payment', payment);
    return payment;
  }

  // Mock bank: pays a pending UPI order through the same signed callback a real provider would send.
  async simulateUpiPayment(businessId: string, id: string, dto: SimulateUpiPaymentDto) {
    if (this.config.get<string>('nodeEnv') === 'production') throw new ForbiddenException('The UPI simulator is off in production');
    const { txnRef, amount } = await this.upiLink(businessId, id);
    const cb: UpiCallback = { txnRef, utr: mockUtr(), amount: dto.amount ?? Number(amount), status: dto.status ?? 'SUCCESS' };
    return this.upiCallback({ ...cb, payerVpa: 'customer@mockupi' }, callbackSignature(this.config.get<string>('upi.webhookSecret')!, cb));
  }

  // One India-time day of UPI: what was billed, what arrived, and everything that doesn't line up.
  // ponytail: a payment is counted on the day it arrives, so an order paid after midnight shows as pending one day
  // and as an unbilled receipt the next; group by order date if day-end cash-up needs it.
  async reconciliation(businessId: string, { date }: ReconciliationQuery) {
    const day = date ?? istPeriod().to; // istPeriod's own default is month to date
    const { from, gte, lt } = istPeriod(day, day);
    const [orders, payments] = await Promise.all([
      this.prisma.posOrder.findMany({
        where: { businessId, paymentMethod: PaymentMethod.UPI, createdAt: { gte, lt } },
        select: { id: true, number: true, total: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.upiPayment.findMany({ where: { businessId, receivedAt: { gte, lt } }, orderBy: { receivedAt: 'asc' } }),
    ]);
    const sum = (xs: { total?: Prisma.Decimal; amount?: Prisma.Decimal }[]) => xs.reduce((s, x) => s.plus(x.total ?? x.amount!), new Prisma.Decimal(0));
    const expected = sum(orders.filter((o) => o.status !== PosOrderStatus.CANCELLED));
    const received = sum(payments.filter((p) => p.status === 'SUCCESS'));
    const by = (...results: UpiCallbackResult[]) => payments.filter((p) => results.includes(p.result));
    return {
      date: from, expected, received, difference: received.minus(expected),
      matched: by(UpiCallbackResult.MATCHED),
      exceptions: by(UpiCallbackResult.AMOUNT_MISMATCH, UpiCallbackResult.ORDER_NOT_PENDING),
      failed: by(UpiCallbackResult.FAILED),
      pending: orders.filter((o) => o.status === PosOrderStatus.PENDING_PAYMENT),
    };
  }

  async receipt(businessId: string, id: string) {
    const [order, business, upiPayments] = await Promise.all([
      this.findOne(businessId, id),
      this.prisma.business.findUniqueOrThrow({ where: { id: businessId }, select: { name: true, gstin: true, address: true, city: true, phone: true } }),
      this.prisma.upiPayment.findMany({ where: { orderId: id }, select: { utr: true, result: true } }),
    ]);
    return { filename: `${order.number.replaceAll('/', '-')}.pdf`, pdf: textPdf(receiptLines({ ...order, upiPayments }, business)) };
  }

  // Mock WhatsApp/SMS send: builds the message and the PDF it would attach, logs it, and tells the till.
  // ponytail: nothing leaves the server; a real provider (WhatsApp Business API, SMS gateway) slots in here.
  async sendReceipt(businessId: string, id: string, dto: SendReceiptDto) {
    const [order, { filename, pdf }, business] = await Promise.all([
      this.findOne(businessId, id),
      this.receipt(businessId, id),
      this.prisma.business.findUniqueOrThrow({ where: { id: businessId }, select: { name: true } }),
    ]);
    const to = dto.to ?? order.customerPhone;
    if (!to) throw new BadRequestException(`${order.number} has no customerPhone; send "to" with the number`);
    const dispatch = {
      messageId: randomUUID(), channel: dto.channel ?? 'WHATSAPP', to, status: 'SENT', provider: 'mock',
      text: `${business.name}: receipt ${order.number}, total Rs. ${order.total.toFixed(2)}. Thank you!`,
      attachment: { filename, bytes: pdf.length },
    };
    this.logger.log(`[mock ${dispatch.channel}] to ${to}: ${dispatch.text} (+${filename})`);
    this.realtime.emitToBusiness(businessId, 'pos.receipt_sent', { orderId: id, ...dispatch });
    return dispatch;
  }

  private byKey(businessId: string, idempotencyKey: string) {
    return this.prisma.posOrder.findUnique({ where: { businessId_idempotencyKey: { businessId, idempotencyKey } }, include: DETAIL });
  }
}
