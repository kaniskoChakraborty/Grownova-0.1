import { randomUUID } from 'crypto';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StockMovementType } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { daysUntil, fefoSlices, forecastLine, istPeriod } from './stock';
import {
  CreateLocationDto, CreateProductDto, CreateVariantDto, ForecastQuery, ListBatchesQuery, ListProductsQuery, PeriodQuery,
  StockMovementDto, StockQuery, StockTransferDto, UpdateLocationDto, UpdateProductDto, UpdateVariantDto,
} from './dto/inventory.dto';

const WITH_VARIANTS = { variants: { orderBy: { createdAt: 'asc' as const } } };
type ActiveVariant = { id: string; sku: string; costPrice: Prisma.Decimal; product: { unit: string } };
const STOCK_DETAIL = {
  variant: { select: { sku: true, name: true, lowStockThreshold: true, product: { select: { name: true, unit: true } } } },
  location: { select: { name: true } },
};
const LEDGER_DETAIL = { ...STOCK_DETAIL, batch: { select: { batchNo: true, expiryDate: true } } };
const VARIANT_NAME = { select: { sku: true, name: true, product: { select: { name: true, unit: true } } } };
const VARIANT_STOCK = {
  id: true, sku: true, name: true, lowStockThreshold: true, product: { select: { name: true, unit: true } },
  stockLevels: {
    where: { location: { isActive: true } },
    select: { locationId: true, quantity: true, location: { select: { name: true } } },
    orderBy: { location: { name: 'asc' as const } },
  },
};
const BATCH_DETAIL = {
  variant: { select: { sku: true, name: true, product: { select: { name: true, unit: true } } } },
  stocks: { where: { quantity: { gt: 0 } }, select: { locationId: true, quantity: true, location: { select: { name: true } } } },
};

// Adds up ledger rows per key: units out (OUT and losses are negative in the ledger, so this flips the sign) and
// their value at each row's unit cost. Largest value first.
function totals<R extends { quantity: Prisma.Decimal; unitCost: Prisma.Decimal }>(rows: R[], key: (row: R) => string) {
  const lines = new Map<string, Omit<R, 'quantity' | 'unitCost'> & { quantity: Prisma.Decimal; value: Prisma.Decimal }>();
  for (const row of rows) {
    const { quantity, unitCost, ...rest } = row;
    const line = lines.get(key(row)) ?? { ...rest, quantity: new Prisma.Decimal(0), value: new Prisma.Decimal(0) };
    line.quantity = line.quantity.minus(quantity);
    line.value = line.value.minus(quantity.times(unitCost));
    lines.set(key(row), line);
  }
  const sorted = [...lines.values()].sort((a, b) => b.value.comparedTo(a.value));
  return { total: sorted.reduce((sum, l) => sum.plus(l.value), new Prisma.Decimal(0)), lines: sorted };
}

// Turns a unique-index clash (duplicate SKU, barcode or location name) into a 409 instead of a 500.
async function unique<T>(write: Promise<T>, what: string): Promise<T> {
  try {
    return await write;
  } catch (e) {
    if ((e as { code?: string }).code === 'P2002') throw new ConflictException(`${what} already exists in this business`);
    throw e;
  }
}

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  // ---- Products and variants ----

  createProduct(businessId: string, { variants, ...product }: CreateProductDto) {
    return unique(
      this.prisma.product.create({
        data: { ...product, businessId, variants: { create: variants.map((v) => ({ ...v, businessId })) } },
        include: WITH_VARIANTS,
      }),
      'A variant with this SKU or barcode',
    );
  }

  findProducts(businessId: string, { q, includeArchived }: ListProductsQuery) {
    return this.prisma.product.findMany({
      where: {
        businessId,
        ...(includeArchived === 'true' ? {} : { isActive: true }),
        ...(q && {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { variants: { some: { OR: [{ sku: { contains: q, mode: 'insensitive' } }, { barcode: q }] } } },
          ],
        }),
      },
      orderBy: { name: 'asc' },
      include: WITH_VARIANTS,
      take: 200, // ponytail: fixed cap, add pagination when a catalogue outgrows it
    });
  }

  async findProduct(businessId: string, id: string) {
    const product = await this.prisma.product.findFirst({ where: { id, businessId }, include: WITH_VARIANTS });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(businessId: string, id: string, dto: UpdateProductDto) {
    await this.findProduct(businessId, id);
    return this.prisma.product.update({ where: { id }, data: dto, include: WITH_VARIANTS });
  }

  async addVariant(businessId: string, productId: string, dto: CreateVariantDto) {
    await this.findProduct(businessId, productId);
    await unique(this.prisma.productVariant.create({ data: { ...dto, businessId, productId } }), 'A variant with this SKU or barcode');
    return this.findProduct(businessId, productId);
  }

  async updateVariant(businessId: string, id: string, dto: UpdateVariantDto) {
    const variant = await this.prisma.productVariant.findFirst({ where: { id, businessId } });
    if (!variant) throw new NotFoundException('Variant not found');
    await unique(this.prisma.productVariant.update({ where: { id }, data: dto }), 'A variant with this SKU or barcode');
    return this.findProduct(businessId, variant.productId);
  }

  // ---- Locations ----

  createLocation(businessId: string, dto: CreateLocationDto) {
    return unique(this.prisma.location.create({ data: { ...dto, businessId } }), 'A location with this name');
  }

  findLocations(businessId: string) {
    return this.prisma.location.findMany({ where: { businessId }, orderBy: [{ isActive: 'desc' }, { name: 'asc' }] });
  }

  async updateLocation(businessId: string, id: string, dto: UpdateLocationDto) {
    const location = await this.prisma.location.findFirst({ where: { id, businessId } });
    if (!location) throw new NotFoundException('Location not found');
    return unique(this.prisma.location.update({ where: { id }, data: dto }), 'A location with this name');
  }

  // ---- Stock ----

  async recordMovement(businessId: string, dto: StockMovementDto, actorId: string) {
    const [variant, location] = await Promise.all([this.activeVariant(businessId, dto.variantId), this.activeLocation(businessId, dto.locationId)]);
    if (dto.type !== StockMovementType.ADJUST && dto.quantity <= 0) throw new BadRequestException('quantity must be more than 0 for IN and OUT');
    if ((dto.expiryDate || dto.mfgDate) && !(dto.type === StockMovementType.IN && dto.batchNo)) {
      throw new BadRequestException('expiryDate and mfgDate can only be set on an IN with a batchNo');
    }
    if (dto.mfgDate && dto.expiryDate && dto.mfgDate > dto.expiryDate) throw new BadRequestException('mfgDate must be on or before expiryDate');
    const rows = await this.prisma.$transaction(async (tx) => {
      const batch = dto.batchNo ? await this.resolveBatch(tx, businessId, variant, dto.type, { ...dto, batchNo: dto.batchNo }) : null;
      return this.applyMovement(tx, variant, location, dto.type, new Prisma.Decimal(dto.quantity), batch, {
        businessId, actorId, unitCost: dto.unitCost ?? variant.costPrice, reference: dto.reference, note: dto.note,
      });
    });
    await this.alert(businessId, variant, rows);
    return rows;
  }

  // Live alerts once a movement is saved (transfers never change a variant's total, so they skip this):
  // 'inventory.low_stock' when the variant's stock across active locations drops to or below its threshold,
  // 'inventory.shrinkage' when a count (ADJUST) finds less than the system had.
  // ponytail: checked after commit, so two sales racing past the threshold can both alert or neither; fine for a nudge.
  async alert(
    businessId: string,
    variant: { id: string; sku: string; lowStockThreshold: number | null },
    rows: { type: StockMovementType; quantity: Prisma.Decimal; unitCost: Prisma.Decimal }[],
  ) {
    const change = rows.reduce((sum, r) => sum.plus(r.quantity), new Prisma.Decimal(0));
    const threshold = variant.lowStockThreshold;
    if (threshold !== null && change.lt(0)) {
      const { _sum } = await this.prisma.stockLevel.aggregate({ where: { variantId: variant.id, location: { isActive: true } }, _sum: { quantity: true } });
      const quantity = _sum.quantity ?? new Prisma.Decimal(0);
      if (quantity.lte(threshold) && quantity.minus(change).gt(threshold)) {
        this.realtime.emitToBusiness(businessId, 'inventory.low_stock', { variantId: variant.id, sku: variant.sku, threshold, quantity });
      }
    }
    const losses = rows.filter((r) => r.type === StockMovementType.ADJUST && r.quantity.lt(0));
    if (losses.length) {
      const value = losses.reduce((sum, r) => sum.minus(r.quantity.times(r.unitCost)), new Prisma.Decimal(0));
      this.realtime.emitToBusiness(businessId, 'inventory.shrinkage', { variantId: variant.id, sku: variant.sku, value, entries: losses });
    }
  }

  // Moves several variants from one location to another. All or nothing: if any item is short, nothing moves.
  // Batches travel with the stock: a named batch moves as asked, otherwise the soonest-expiring batches go first.
  async transfer(businessId: string, dto: StockTransferDto, actorId: string) {
    if (dto.fromLocationId === dto.toLocationId) throw new BadRequestException('fromLocationId and toLocationId must differ');
    const [from, to, variants] = await Promise.all([
      this.activeLocation(businessId, dto.fromLocationId),
      this.activeLocation(businessId, dto.toLocationId),
      Promise.all(dto.items.map((i) => this.activeVariant(businessId, i.variantId))),
    ]);
    const transferId = randomUUID();
    const entry = { businessId, actorId, transferId, reference: dto.reference, note: dto.note };
    // Stock rows are locked in one global order (variant id, then location id) so two opposite transfers can't deadlock.
    const items = dto.items
      .map((item, i) => ({ ...item, variant: variants[i], quantity: new Prisma.Decimal(item.quantity) }))
      .sort((a, b) => (a.variant.id < b.variant.id ? -1 : 1));
    const entries = await this.prisma.$transaction(async (tx) => {
      const done = [];
      for (const { variant, quantity, batchNo } of items) {
        for (const location of from.id < to.id ? [from, to] : [to, from]) await this.lockLevel(tx, businessId, variant.id, location.id);
        const batch = batchNo ? await this.resolveBatch(tx, businessId, variant, StockMovementType.TRANSFER_OUT, { batchNo }) : null;
        const out = await this.applyMovement(tx, variant, from, StockMovementType.TRANSFER_OUT, quantity, batch, { ...entry, unitCost: variant.costPrice });
        done.push(...out);
        for (const o of out) {
          const moved = o.batch ? { id: o.batchId!, batchNo: o.batch.batchNo } : null;
          done.push(...(await this.applyMovement(tx, variant, to, StockMovementType.TRANSFER_IN, o.quantity.neg(), moved, { ...entry, unitCost: o.unitCost })));
        }
      }
      return done;
    });
    return { transferId, entries };
  }

  // The batch a movement names. An IN creates it the first time; anything else needs it to exist already.
  private async resolveBatch(
    tx: Prisma.TransactionClient,
    businessId: string,
    variant: ActiveVariant,
    type: StockMovementType,
    { batchNo, expiryDate, mfgDate }: { batchNo: string; expiryDate?: string; mfgDate?: string },
  ) {
    const batch = await tx.batch.findUnique({ where: { variantId_batchNo: { variantId: variant.id, batchNo } } });
    if (batch) {
      const saved = batch.expiryDate?.toISOString().slice(0, 10);
      if (expiryDate && saved !== expiryDate.slice(0, 10)) {
        throw new BadRequestException(`Batch ${batchNo} of ${variant.sku} already exists with expiry ${saved ?? 'not set'}`);
      }
      return batch;
    }
    if (type !== StockMovementType.IN) throw new NotFoundException(`Batch ${batchNo} of ${variant.sku} not found`);
    return unique(
      tx.batch.create({
        data: { businessId, variantId: variant.id, batchNo, expiryDate: expiryDate && new Date(expiryDate), mfgDate: mfgDate && new Date(mfgDate) },
      }),
      `Batch ${batchNo}`,
    );
  }

  // The no-op increment row-locks the variant's stock level at a location, so movements on it queue up instead of
  // two of them reading the same balance and overselling. Batch stock there is only changed while holding this lock.
  lockLevel(tx: Prisma.TransactionClient, businessId: string, variantId: string, locationId: string) {
    return tx.stockLevel.upsert({
      where: { variantId_locationId: { variantId, locationId } },
      create: { variantId, locationId, businessId },
      update: { quantity: { increment: 0 } },
    });
  }

  // Every stock change goes through here, inside the caller's transaction: ledger rows (one per batch touched),
  // the batch stock, and the variant's stock level at the location.
  async applyMovement(
    tx: Prisma.TransactionClient,
    variant: ActiveVariant,
    location: { id: string; name: string },
    type: StockMovementType,
    amount: Prisma.Decimal,
    batch: { id: string; batchNo: string } | null,
    entry: { businessId: string; actorId: string; unitCost: Prisma.Decimal | number; reference?: string; note?: string; transferId?: string; posOrderId?: string },
  ) {
    const ids = { variantId: variant.id, locationId: location.id };
    const level = await this.lockLevel(tx, entry.businessId, variant.id, location.id);
    const rows = [];
    let balance = level.quantity;
    const write = async (quantity: Prisma.Decimal, batchId: string | null) => {
      balance = balance.plus(quantity);
      if (batchId) {
        await tx.batchStock.upsert({
          where: { batchId_locationId: { batchId, locationId: location.id } },
          create: { batchId, locationId: location.id, quantity },
          update: { quantity: { increment: quantity } },
        });
      }
      rows.push(await tx.stockLedgerEntry.create({ data: { ...entry, ...ids, type, quantity, balanceAfter: balance, batchId }, include: LEDGER_DETAIL }));
    };
    const short = (have: Prisma.Decimal, of = '') =>
      new BadRequestException(`Only ${have.toString()} ${variant.product.unit} of ${variant.sku}${of} in stock at ${location.name}`);
    const inBatch = async (batchId: string) =>
      (await tx.batchStock.findUnique({ where: { batchId_locationId: { batchId, locationId: location.id } } }))?.quantity ?? new Prisma.Decimal(0);
    const batchesHere = () =>
      tx.batchStock.findMany({
        where: { locationId: location.id, quantity: { gt: 0 }, batch: { variantId: variant.id } },
        orderBy: [{ batch: { expiryDate: { sort: 'asc', nulls: 'last' } } }, { batch: { createdAt: 'asc' } }],
      });

    if (type === StockMovementType.IN || type === StockMovementType.TRANSFER_IN) {
      await write(amount, batch?.id ?? null);
    } else if (type === StockMovementType.OUT || type === StockMovementType.TRANSFER_OUT) {
      if (amount.gt(level.quantity)) throw short(level.quantity);
      if (batch) {
        const have = await inBatch(batch.id);
        if (amount.gt(have)) throw short(have, ` batch ${batch.batchNo}`);
        await write(amount.neg(), batch.id);
      } else {
        for (const slice of fefoSlices(await batchesHere(), amount)) await write(slice.quantity.neg(), slice.batchId);
      }
    } else if (batch) {
      // ADJUST of one batch: amount is what was counted of that batch.
      await write(amount.minus(await inBatch(batch.id)), batch.id);
    } else {
      // ADJUST of the whole variant: amount is the full count, and it can't be less than what batches hold.
      const batched = (await batchesHere()).reduce((sum, b) => sum.plus(b.quantity), new Prisma.Decimal(0));
      if (amount.lt(batched)) {
        throw new BadRequestException(`${batched.toString()} ${variant.product.unit} of ${variant.sku} at ${location.name} is in batches; count those with batchNo first`);
      }
      await write(amount.minus(level.quantity), null);
    }
    await tx.stockLevel.update({ where: { variantId_locationId: ids }, data: { quantity: balance } });
    return rows;
  }

  async activeVariant(businessId: string, id: string) {
    const variant = await this.prisma.productVariant.findFirst({ where: { id, businessId, isActive: true }, include: { product: { select: { unit: true } } } });
    if (!variant) throw new NotFoundException(`Variant ${id} not found or archived`);
    return variant;
  }

  async activeLocation(businessId: string, id: string) {
    const location = await this.prisma.location.findFirst({ where: { id, businessId, isActive: true } });
    if (!location) throw new NotFoundException(`Location ${id} not found or archived`);
    return location;
  }

  // Scanner lookup: the active variant with this barcode, its product, and stock at every location.
  async findByBarcode(businessId: string, barcode: string) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { businessId, barcode, isActive: true },
      include: {
        product: { select: { id: true, name: true, unit: true, hsnCode: true } },
        stockLevels: { select: { locationId: true, quantity: true, location: { select: { name: true } } }, orderBy: { location: { name: 'asc' } } },
      },
    });
    if (!variant) throw new NotFoundException(`No product with barcode ${barcode}`);
    return variant;
  }

  // ---- Batches ----

  findBatches(businessId: string, { variantId, batchNo }: ListBatchesQuery) {
    return this.prisma.batch.findMany({
      where: { businessId, variantId, batchNo },
      include: BATCH_DETAIL,
      orderBy: [{ expiryDate: { sort: 'asc', nulls: 'last' } }, { createdAt: 'asc' }],
      take: 200, // ponytail: fixed cap, paginate with reports
    });
  }

  // Batches that still have stock and expire within `days` (already expired ones included, daysLeft < 0).
  // Without businessId it covers every business, for the daily expiry job.
  async expiringBatches(days: number, businessId?: string) {
    const batches = await this.prisma.batch.findMany({
      where: { businessId, expiryDate: { lte: new Date(Date.now() + days * 86_400_000) }, stocks: { some: { quantity: { gt: 0 } } } },
      include: BATCH_DETAIL,
      orderBy: { expiryDate: 'asc' },
      take: 500, // ponytail: fixed cap per scan
    });
    return batches.map((b) => ({
      ...b,
      daysLeft: daysUntil(b.expiryDate!),
      quantity: b.stocks.reduce((sum, st) => sum.plus(st.quantity), new Prisma.Decimal(0)),
    }));
  }

  // Where a batch came from and where it went: every ledger row for it, oldest first, plus where it sits now.
  async traceBatch(businessId: string, id: string) {
    const batch = await this.prisma.batch.findFirst({
      where: { id, businessId },
      include: { ...BATCH_DETAIL, ledger: { include: LEDGER_DETAIL, orderBy: { createdAt: 'asc' } } },
    });
    if (!batch) throw new NotFoundException('Batch not found');
    return batch;
  }

  // ---- Low stock, reports and forecast ----

  private async variantsWithStock(businessId: string, where: Prisma.ProductVariantWhereInput = {}) {
    const variants = await this.prisma.productVariant.findMany({
      where: { ...where, businessId, isActive: true, product: { isActive: true } },
      select: VARIANT_STOCK,
      orderBy: { sku: 'asc' },
      take: 1000, // ponytail: fixed cap, page it when a business has more active SKUs
    });
    return variants.map((v) => ({ ...v, quantity: v.stockLevels.reduce((sum, l) => sum.plus(l.quantity), new Prisma.Decimal(0)) }));
  }

  // Variants whose stock across active locations is at or below their lowStockThreshold.
  async lowStock(businessId: string) {
    const variants = await this.variantsWithStock(businessId, { lowStockThreshold: { not: null } });
    return variants.filter((v) => v.quantity.lte(v.lowStockThreshold!));
  }

  private period({ from, to }: PeriodQuery) {
    const period = istPeriod(from, to);
    if (period.gte >= period.lt) throw new BadRequestException('from must be on or before to');
    return period;
  }

  // Cost of goods sold: units sold (OUT) in the period at the unit cost recorded on each sale, per variant.
  // ponytail: rows are summed in JS; move the sum into SQL if a month of sales outgrows memory.
  async cogs(businessId: string, query: PeriodQuery) {
    const { from, to, gte, lt } = this.period(query);
    const rows = await this.prisma.stockLedgerEntry.findMany({
      where: { businessId, type: StockMovementType.OUT, createdAt: { gte, lt } },
      select: { variantId: true, quantity: true, unitCost: true, variant: VARIANT_NAME },
    });
    return { from, to, ...totals(rows, (r) => r.variantId) };
  }

  // Shrinkage: stock that physical counts (ADJUST) found missing in the period, per variant and location, at cost.
  async shrinkage(businessId: string, query: PeriodQuery) {
    const { from, to, gte, lt } = this.period(query);
    const rows = await this.prisma.stockLedgerEntry.findMany({
      where: { businessId, type: StockMovementType.ADJUST, quantity: { lt: 0 }, createdAt: { gte, lt } },
      select: { variantId: true, locationId: true, quantity: true, unitCost: true, variant: VARIANT_NAME, location: { select: { name: true } } },
    });
    return { from, to, ...totals(rows, (r) => `${r.variantId}/${r.locationId}`) };
  }

  // Demand forecast v1 for every active variant, the ones that will run out soonest first.
  async forecast(businessId: string, { days = 30, horizon = 14 }: ForecastQuery) {
    const [variants, sold] = await Promise.all([
      this.variantsWithStock(businessId),
      this.prisma.stockLedgerEntry.groupBy({
        by: ['variantId'],
        where: { businessId, type: StockMovementType.OUT, createdAt: { gte: new Date(Date.now() - days * 86_400_000) } },
        _sum: { quantity: true },
      }),
    ]);
    const soldBy = new Map(sold.map((s) => [s.variantId, (s._sum.quantity ?? new Prisma.Decimal(0)).neg()]));
    return variants
      .map((v) => {
        const unitsSold = soldBy.get(v.id) ?? new Prisma.Decimal(0);
        return { ...v, sold: unitsSold, ...forecastLine(unitsSold, days, v.quantity, horizon, v.lowStockThreshold) };
      })
      .sort((a, b) => (a.daysOfCover ?? Infinity) - (b.daysOfCover ?? Infinity));
  }

  findStock(businessId: string, { locationId, variantId }: StockQuery) {
    return this.prisma.stockLevel.findMany({
      where: { businessId, locationId, variantId },
      include: STOCK_DETAIL,
      orderBy: [{ variant: { sku: 'asc' } }, { location: { name: 'asc' } }],
      take: 500, // ponytail: fixed cap, paginate when a business has more SKU-location pairs
    });
  }

  findLedger(businessId: string, { locationId, variantId }: StockQuery) {
    return this.prisma.stockLedgerEntry.findMany({
      where: { businessId, locationId, variantId },
      include: LEDGER_DETAIL,
      orderBy: { createdAt: 'desc' },
      take: 200, // ponytail: newest 200, add date filters and paging with reports
    });
  }
}
