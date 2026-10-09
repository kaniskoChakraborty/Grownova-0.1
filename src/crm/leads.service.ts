import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  create(businessId: string, dto: CreateLeadDto) {
    if (!dto.name && !dto.phone) {
      throw new BadRequestException('A lead needs at least a name or a phone number');
    }
    // Fields picked explicitly so a client can never set businessId/source via the body.
    const { name, phone, email, notes } = dto;
    return this.prisma.lead.create({ data: { businessId, name, phone, email, notes } });
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
    await this.findOne(businessId, id); // tenant check before writing
    const { name, phone, email, notes, status } = dto;
    return this.prisma.lead.update({ where: { id }, data: { name, phone, email, notes, status } });
  }
}
