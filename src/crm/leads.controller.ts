import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLeadDto, ListLeadsQuery, MoveLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { LeadResponseDto } from './dto/lead-response.dto';
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
  @ApiCreatedResponse({ type: LeadResponseDto })
  create(@Req() req: AuthedRequest, @Body() dto: CreateLeadDto) {
    return this.leads.create(req.user.businessId, dto);
  }

  @Get()
  @Roles(...ALL)
  @ApiOkResponse({ type: [LeadResponseDto] })
  findAll(@Req() req: AuthedRequest, @Query() query: ListLeadsQuery) {
    return this.leads.findAll(req.user.businessId, query.status);
  }

  @Get(':id')
  @Roles(...ALL)
  @ApiOkResponse({ type: LeadResponseDto })
  findOne(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.leads.findOne(req.user.businessId, id);
  }

  @Patch(':id')
  @Roles(...WRITERS)
  @ApiOkResponse({ type: LeadResponseDto })
  update(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leads.update(req.user.businessId, id, dto);
  }

  @Patch(':id/stage')
  @Roles(...WRITERS)
  @ApiOkResponse({ type: LeadResponseDto, description: 'Move the lead to another pipeline stage' })
  move(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: MoveLeadDto) {
    return this.leads.move(req.user.businessId, id, dto.status);
  }

  @Post(':id/enrich')
  @Roles(...WRITERS)
  @ApiCreatedResponse({ type: LeadResponseDto, description: 'GrowAI enrichment: LLM if configured, otherwise rules' })
  enrich(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.leads.enrich(req.user.businessId, id);
  }
}
