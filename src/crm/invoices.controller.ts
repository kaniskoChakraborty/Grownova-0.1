import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateInvoiceDto, InvoiceResponseDto, ListInvoicesQuery, RecordPaymentDto } from './dto/invoice.dto';
import { InvoicesService } from './invoices.service';

type AuthedRequest = { user: { id: string; businessId: string } };

const ALL = [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.OPS, UserRole.EMPLOYEE];
const MONEY = [UserRole.OWNER, UserRole.ACCOUNTANT];

@ApiTags('CRM - Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crm/invoices')
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}

  @Post()
  @Roles(...MONEY)
  @ApiCreatedResponse({ type: InvoiceResponseDto })
  create(@Req() req: AuthedRequest, @Body() dto: CreateInvoiceDto) {
    return this.invoices.create(req.user.businessId, dto);
  }

  @Get()
  @Roles(...ALL)
  @ApiOkResponse({ type: [InvoiceResponseDto] })
  findAll(@Req() req: AuthedRequest, @Query() query: ListInvoicesQuery) {
    return this.invoices.findAll(req.user.businessId, query);
  }

  @Get(':id')
  @Roles(...ALL)
  @ApiOkResponse({ type: InvoiceResponseDto })
  findOne(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.invoices.findOne(req.user.businessId, id);
  }

  @Post(':id/payments')
  @Roles(...MONEY)
  @ApiCreatedResponse({ type: InvoiceResponseDto, description: 'Record a payment. When the invoice is fully paid it becomes PAID and its lead moves to WON.' })
  recordPayment(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: RecordPaymentDto) {
    return this.invoices.recordPayment(req.user.businessId, id, dto, req.user.id);
  }
}
