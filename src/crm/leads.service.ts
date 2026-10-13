import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LeadSource, LeadStatus, Prisma } from '../../generated/prisma/client';
import { GrowaiService } from '../growai/growai.service';
import { scoreLead } from '../growai/growai.rules';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { ParsedLead } from './lead-parser';
import { canMove, NEXT_STAGES } from './pipeline';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly growai: GrowaiService,
  ) {}

  create(businessId: string, dto: CreateLeadDto) {
    if (!dto.name && !dto.phone) {
      throw new BadRequestException('A lead needs at least a name or a phone number');
    }
    // Fields picked explicitly so a client can never set businessId/source via the body.
    const { name, phone, email, notes } = dto;
    return this.prisma.lead.create({ data: { businessId, name, phone, email, notes } });
  }

  // Same sender again -> update that lead instead of creating a duplicate.
  // ponytail: keeps only the latest message; a message history table comes with support tickets (Phase 18).
  async createFromWhatsApp(businessId: string, lead: ParsedLead, rawMessage: string) {
    const { name, phone, email } = lead;
    const existing = phone ? await this.prisma.lead.findFirst({ where: { businessId, phone } }) : null;
    if (existing) {
      return this.prisma.lead.update({
        where: { id: existing.id },
        data: { rawMessage, name: existing.name ?? name, email: existing.email ?? email },
      });
    }
    return this.prisma.lead.create({
      data: { businessId, name, phone, email, rawMessage, source: LeadSource.WHATSAPP },
    });
  }

  findAll(businessId: string, status?: LeadStatus) {
    return this.prisma.lead.findMany({
      where: { businessId, status },
      orderBy: { createdAt: 'desc' },
      take: 100, // ponytail: fixed cap, add cursor pagination when a business passes 100 leads
    });
  }

  async findOne(businessId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, businessId } });
    if (!lead) throw new NotFoundException('Lead not found'); // also what other tenants get
    return lead;
  }

  async update(businessId: string, id: string, dto: UpdateLeadDto) {
    const lead = await this.findOne(businessId, id); // tenant check before writing
    const { name, phone, email, notes, status } = dto;
    if (status && status !== lead.status) this.assertCanMove(lead.status, status);
    return this.prisma.lead.update({ where: { id }, data: { name, phone, email, notes, status } });
  }

  async move(businessId: string, id: string, to: LeadStatus) {
    const lead = await this.findOne(businessId, id);
    this.assertCanMove(lead.status, to);
    return this.prisma.lead.update({ where: { id }, data: { status: to } });
  }

  private assertCanMove(from: LeadStatus, to: LeadStatus) {
    if (canMove(from, to)) return;
    const allowed = NEXT_STAGES[from].join(', ') || 'none (final stage)';
    throw new BadRequestException(`Cannot move lead from ${from} to ${to}. Allowed: ${allowed}`);
  }

  async enrich(businessId: string, id: string) {
    const lead = await this.findOne(businessId, id);
    const text = lead.rawMessage ?? lead.notes;
    if (!text) throw new BadRequestException('Lead has no message or notes to enrich');
    const enrichment = await this.growai.enrichLead(text, lead.name);
    return this.prisma.lead.update({
      where: { id },
      data: {
        enrichment: enrichment as Prisma.InputJsonValue,
        score: scoreLead(enrichment.intent, text, lead),
      },
    });
  }
}
