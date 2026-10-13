import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { LeadSource, LeadStatus, Prisma } from '../../generated/prisma/client';
import { GrowaiService } from '../growai/growai.service';
import { scoreLead } from '../growai/growai.rules';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateLeadDto, CreateReminderDto, UpdateLeadDto } from './dto/lead.dto';
import { ParsedLead } from './lead-parser';
import { canMove, NEXT_STAGES, nextStage, shouldAutoQualify } from './pipeline';
import { REMINDERS_QUEUE } from './reminders.processor';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly growai: GrowaiService,
    private readonly realtime: RealtimeGateway,
    @InjectQueue(REMINDERS_QUEUE) private readonly reminderQueue: Queue,
  ) {}

  async create(businessId: string, dto: CreateLeadDto) {
    if (!dto.name && !dto.phone) {
      throw new BadRequestException('A lead needs at least a name or a phone number');
    }
    // Fields picked explicitly so a client can never set businessId/source via the body.
    const { name, phone, email, notes } = dto;
    const lead = await this.prisma.lead.create({ data: { businessId, name, phone, email, notes } });
    this.realtime.emitToBusiness(businessId, 'lead.created', lead);
    return lead;
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
    const created = await this.prisma.lead.create({
      data: { businessId, name, phone, email, rawMessage, source: LeadSource.WHATSAPP },
    });
    this.realtime.emitToBusiness(businessId, 'lead.created', created);
    return created;
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

  async update(businessId: string, id: string, dto: UpdateLeadDto, actorId: string) {
    const lead = await this.findOne(businessId, id); // tenant check before writing
    const { name, phone, email, notes, status } = dto;
    const data = { name, phone, email, notes };
    if (!status || status === lead.status) return this.prisma.lead.update({ where: { id }, data });
    this.assertCanMove(lead.status, status);
    return this.changeStage(lead, status, actorId, data);
  }

  async move(businessId: string, id: string, to: LeadStatus, actorId: string) {
    const lead = await this.findOne(businessId, id);
    this.assertCanMove(lead.status, to);
    return this.changeStage(lead, to, actorId);
  }

  async advance(businessId: string, id: string, actorId: string) {
    const lead = await this.findOne(businessId, id);
    const to = nextStage(lead.status);
    if (!to) throw new BadRequestException(`Lead is ${lead.status}, which is a final stage`);
    return this.changeStage(lead, to, actorId);
  }

  // A fully paid invoice wins the lead from any open stage, skipping the one-step rule. WON/LOST leads stay put.
  async winFromPayment(businessId: string, id: string, actorId: string) {
    const lead = await this.findOne(businessId, id);
    if (lead.status === LeadStatus.WON || lead.status === LeadStatus.LOST) return lead;
    return this.changeStage(lead, LeadStatus.WON, actorId);
  }

  async history(businessId: string, id: string) {
    await this.findOne(businessId, id);
    return this.prisma.leadStageEvent.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'asc' },
      include: { actor: { select: { id: true, name: true } } },
    });
  }

  async addReminder(businessId: string, id: string, dto: CreateReminderDto, actorId: string) {
    await this.findOne(businessId, id);
    const dueAt = new Date(dto.dueAt);
    const reminder = await this.prisma.leadReminder.create({
      data: { leadId: id, note: dto.note, dueAt, createdById: actorId },
    });
    // jobId = reminder id, so the same reminder can never be queued twice.
    await this.reminderQueue.add(
      'send',
      { reminderId: reminder.id },
      { jobId: reminder.id, delay: Math.max(0, dueAt.getTime() - Date.now()), attempts: 3, removeOnComplete: true },
    );
    return reminder;
  }

  async reminders(businessId: string, id: string) {
    await this.findOne(businessId, id);
    return this.prisma.leadReminder.findMany({ where: { leadId: id }, orderBy: { dueAt: 'asc' } });
  }

  // Every stage change goes through here so the lead and its history can't disagree.
  // actorId null = the system moved it (auto-qualify).
  private async changeStage(
    lead: { id: string; businessId: string; status: LeadStatus },
    to: LeadStatus,
    actorId: string | null,
    data: Prisma.LeadUpdateInput = {},
  ) {
    const [updated] = await this.prisma.$transaction([
      this.prisma.lead.update({ where: { id: lead.id }, data: { ...data, status: to } }),
      this.prisma.leadStageEvent.create({
        data: { leadId: lead.id, fromStatus: lead.status, toStatus: to, actorId },
      }),
    ]);
    this.realtime.emitToBusiness(lead.businessId, 'lead.stage_changed', {
      lead: updated,
      fromStatus: lead.status,
      toStatus: to,
      actorId,
    });
    return updated;
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
    const score = scoreLead(enrichment.intent, text, lead);
    const data = { enrichment: enrichment as Prisma.InputJsonValue, score };
    if (shouldAutoQualify(lead.status, score)) return this.changeStage(lead, LeadStatus.QUALIFIED, null, data);
    return this.prisma.lead.update({ where: { id }, data });
  }
}
