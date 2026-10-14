import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, ListInvoicesQuery, RecordPaymentDto } from './dto/invoice.dto';
import { LeadsService } from './leads.service';
import { mockIrn } from './irn';
import { debtorAgeing } from './ageing';

const DEFAULT_CREDIT_DAYS = 30;
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
    // ponytail: count+1 numbering; two invoices created at the same instant hit the unique index and one fails.
    // Proper per-financial-year GST numbering comes with the invoice edge cases step.
    const count = await this.prisma.invoice.count({ where: { businessId } });
    return this.prisma.invoice.create({
      data: { businessId, leadId: dto.leadId, number: `INV-${String(count + 1).padStart(4, '0')}`, total: dto.total, dueDate },
      include: DETAIL,
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
    const paid = await this.prisma.$transaction(async (tx) => {
      // The increment row-locks the invoice, so concurrent payments can't overshoot the total together.
      const updated = await tx.invoice.update({ where: { id }, data: { amountPaid: { increment: dto.amount } } });
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
    if (invoice.irn) return invoice;
    const business = await this.prisma.business.findUniqueOrThrow({ where: { id: businessId }, select: { gstin: true } });
    if (!business.gstin) throw new BadRequestException('Add your GSTIN to the business (PATCH /businesses/:id) before generating an IRN');
    const { irn, ackNo } = mockIrn(business.gstin, invoice.number, invoice.createdAt);
    return this.prisma.invoice.update({ where: { id }, data: { irn, ackNo, ackDate: new Date() }, include: DETAIL });
  }

  async ageing(businessId: string) {
    const open = await this.prisma.invoice.findMany({
      where: { businessId, status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] } },
      select: { leadId: true, total: true, amountPaid: true, dueDate: true, lead: { select: { name: true } } },
    });
    return debtorAgeing(open);
  }
}
