import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, ListInvoicesQuery, RecordPaymentDto } from './dto/invoice.dto';
import { LeadsService } from './leads.service';
import { financialYear, mockIrn } from './irn';
import { debtorAgeing } from './ageing';

const DEFAULT_CREDIT_DAYS = 30;
const IRN_CANCEL_WINDOW_MS = 24 * 3_600_000; // the GST portal only lets an IRN be cancelled within 24 hours
const OPEN = [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID];
const DETAIL = {
  lead: { select: { id: true, name: true, status: true } },
  payments: { orderBy: { paidAt: 'asc' as const } },
};

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leads: LeadsService,
  ) {}

  async create(businessId: string, dto: CreateInvoiceDto) {
    await this.leads.findOne(businessId, dto.leadId); // lead must belong to this business
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : new Date(Date.now() + DEFAULT_CREDIT_DAYS * 86_400_000);
    const fy = financialYear(new Date());
    // The counter upsert locks this business's row for the year, so two invoices can't get the same number,
    // and the transaction rolls the number back if the invoice insert fails, so the series has no gaps.
    // ponytail: 4-digit serial keeps the number within GST's 16-character limit up to 9999 invoices a year.
    return this.prisma.$transaction(async (tx) => {
      const { last } = await tx.invoiceCounter.upsert({
        where: { businessId_series_fy: { businessId, series: 'INV', fy } },
        create: { businessId, series: 'INV', fy, last: 1 },
        update: { last: { increment: 1 } },
      });
      return tx.invoice.create({
        data: { businessId, leadId: dto.leadId, number: `INV/${fy}/${String(last).padStart(4, '0')}`, total: dto.total, dueDate },
        include: DETAIL,
      });
    });
  }

  findAll(businessId: string, query: ListInvoicesQuery) {
    return this.prisma.invoice.findMany({
      where: { businessId, leadId: query.leadId, status: query.status },
      orderBy: { createdAt: 'desc' },
      include: DETAIL,
      take: 100, // ponytail: fixed cap, add pagination with debtor ageing if needed
    });
  }

  async findOne(businessId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id, businessId }, include: DETAIL });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  // Records a payment. Once the invoice is fully paid, its lead moves to WON.
  async recordPayment(businessId: string, id: string, dto: RecordPaymentDto, actorId: string) {
    const invoice = await this.findOne(businessId, id);
    if (invoice.status === InvoiceStatus.PAID) throw new BadRequestException(`${invoice.number} is already fully paid`);
    if (invoice.status === InvoiceStatus.CANCELLED) throw new BadRequestException(`${invoice.number} is cancelled`);
    const paid = await this.prisma.$transaction(async (tx) => {
      // The increment row-locks the invoice, so concurrent payments can't overshoot the total together,
      // and the status filter stops a payment landing on an invoice cancelled a moment ago.
      const { count } = await tx.invoice.updateMany({ where: { id, status: { in: OPEN } }, data: { amountPaid: { increment: dto.amount } } });
      if (!count) throw new BadRequestException(`${invoice.number} is no longer open for payments`);
      const updated = await tx.invoice.findUniqueOrThrow({ where: { id } });
      if (updated.amountPaid.greaterThan(updated.total)) {
        const owed = updated.total.minus(updated.amountPaid).plus(dto.amount);
        throw new BadRequestException(`Payment is more than the ${owed.toString()} still owed on ${invoice.number}`);
      }
      await tx.invoicePayment.create({
        data: { invoiceId: id, amount: dto.amount, method: dto.method, reference: dto.reference, recordedById: actorId },
      });
      const status = updated.amountPaid.equals(updated.total) ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;
      await tx.invoice.update({ where: { id }, data: { status } });
      return status === InvoiceStatus.PAID;
    });
    if (paid) await this.leads.winFromPayment(businessId, invoice.leadId, actorId);
    return this.findOne(businessId, id);
  }

  // Registers the invoice with the (mock) GST portal. Asking again returns the IRN already issued.
  async generateIrn(businessId: string, id: string) {
    const invoice = await this.findOne(businessId, id);
    if (invoice.status === InvoiceStatus.CANCELLED) throw new BadRequestException(`${invoice.number} is cancelled`);
    if (invoice.irn) return invoice;
    const business = await this.prisma.business.findUniqueOrThrow({ where: { id: businessId }, select: { gstin: true } });
    if (!business.gstin) throw new BadRequestException('Add your GSTIN to the business (PATCH /businesses/:id) before generating an IRN');
    const { irn, ackNo } = mockIrn(business.gstin, invoice.number, invoice.createdAt);
    return this.prisma.invoice.update({ where: { id }, data: { irn, ackNo, ackDate: new Date() }, include: DETAIL });
  }

  async ageing(businessId: string) {
    const open = await this.prisma.invoice.findMany({
      where: { businessId, status: { in: OPEN } },
      select: { leadId: true, total: true, amountPaid: true, dueDate: true, lead: { select: { name: true } } },
    });
    return debtorAgeing(open);
  }

  // Only an unpaid invoice can be cancelled; once money is in, it needs a credit note instead (not built yet).
  async cancel(businessId: string, id: string, reason: string) {
    const invoice = await this.findOne(businessId, id);
    if (invoice.ackDate && Date.now() - invoice.ackDate.getTime() > IRN_CANCEL_WINDOW_MS) {
      throw new BadRequestException(`The IRN for ${invoice.number} is more than 24 hours old, so GST no longer allows cancelling it. Issue a credit note instead.`);
    }
    const { count } = await this.prisma.invoice.updateMany({
      where: { id, status: InvoiceStatus.UNPAID },
      data: { status: InvoiceStatus.CANCELLED, cancelledAt: new Date(), cancelReason: reason },
    });
    if (!count) throw new BadRequestException(`Only unpaid invoices can be cancelled, and ${invoice.number} is ${invoice.status}`);
    return this.findOne(businessId, id);
  }
}
