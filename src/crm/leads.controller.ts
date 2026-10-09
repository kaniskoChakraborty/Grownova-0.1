import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLeadDto, ListLeadsQuery, UpdateLeadDto } from './dto/lead.dto';
import { LeadsService } from './leads.service';

type AuthedRequest = { user: { businessId: string } }; // set by JwtStrategy.validate()

const ALL = [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.OPS, UserRole.EMPLOYEE];
const WRITERS = [UserRole.OWNER, UserRole.OPS, UserRole.EMPLOYEE];

@ApiTags('CRM - Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crm/leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  @Roles(...WRITERS)
  create(@Req() req: AuthedRequest, @Body() dto: CreateLeadDto) {
    return this.leads.create(req.user.businessId, dto);
  }

  @Get()
  @Roles(...ALL)
  findAll(@Req() req: AuthedRequest, @Query() query: ListLeadsQuery) {
    return this.leads.findAll(req.user.businessId, query.status);
  }

  @Get(':id')
  @Roles(...ALL)
  findOne(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.leads.findOne(req.user.businessId, id);
  }

  @Patch(':id')
  @Roles(...WRITERS)
  update(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leads.update(req.user.businessId, id, dto);
  }
}
