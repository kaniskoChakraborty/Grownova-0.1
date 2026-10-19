import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Query, Req, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CancelPosOrderDto, CreatePosOrderDto, EwayBillDto, ListConflictsQuery, ListPosOrdersQuery, PosOrderDto, PosSyncDto, PosSyncResultDto, ReceiptDispatchDto, ReconciliationDto,
  ReconciliationQuery, ResolveConflictDto, SendReceiptDto, SimulateUpiPaymentDto, SyncConflictDto, UpiLinkDto, UpiPaymentDto,
} from './dto/pos.dto';
import { PosService } from './pos.service';

type AuthedRequest = { user: { id: string; businessId: string } };

const ALL = [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.OPS, UserRole.EMPLOYEE];
const SELL = [UserRole.OWNER, UserRole.OPS, UserRole.EMPLOYEE];
const VOID = [UserRole.OWNER, UserRole.OPS];
const MONEY = [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.OPS];

@ApiTags('POS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pos')
export class PosController {
  constructor(private readonly pos: PosService) {}

  @Post('orders')
  @Roles(...SELL)
  @ApiHeader({ name: 'Idempotency-Key', required: false, description: 'Any unique string per sale (e.g. a UUID made by the till). Sending it again returns the same order instead of selling twice.' })
  @ApiCreatedResponse({ type: PosOrderDto, description: 'Sell items at a location. Stock is deducted at once; 400 if any item is short (nothing is sold).' })
  create(@Req() req: AuthedRequest, @Body() dto: CreatePosOrderDto, @Headers('idempotency-key') key?: string) {
    if (key !== undefined && !/^[\w.:-]{1,100}$/.test(key)) throw new BadRequestException('Idempotency-Key must be 1-100 letters, digits or _ . : -');
    return this.pos.create(req.user.businessId, dto, req.user.id, key);
  }

  @Get('orders')
  @Roles(...ALL)
  @ApiOkResponse({ type: [PosOrderDto], description: 'Latest 100 orders, newest first' })
  findAll(@Req() req: AuthedRequest, @Query() query: ListPosOrdersQuery) {
    return this.pos.findAll(req.user.businessId, query);
  }

  @Get('orders/:id')
  @Roles(...ALL)
  @ApiOkResponse({ type: PosOrderDto })
  findOne(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.pos.findOne(req.user.businessId, id);
  }

  @Post('orders/:id/cancel')
  @Roles(...VOID)
  @ApiCreatedResponse({ type: PosOrderDto, description: 'Void a sale; its stock goes back to the same batches and location' })
  cancel(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: CancelPosOrderDto) {
    return this.pos.cancel(req.user.businessId, id, dto, req.user.id);
  }

  @Post('orders/:id/eway-bill')
  @Roles(...VOID)
  @ApiCreatedResponse({ type: PosOrderDto, description: 'Mock GSTN e-way bill for a paid order leaving on a vehicle (needed above Rs. 50,000). Needs the business GSTIN and HSN codes on every item.' })
  ewayBill(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: EwayBillDto) {
    return this.pos.ewayBill(req.user.businessId, id, dto);
  }

  @Post('orders/:id/upi')
  @Roles(...SELL)
  @ApiCreatedResponse({ type: UpiLinkDto, description: 'UPI link for a pending UPI order; show it as a QR. Needs the business upiId.' })
  upiLink(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.pos.upiLink(req.user.businessId, id);
  }

  @Post('orders/:id/upi/simulate-payment')
  @Roles(...SELL)
  @ApiCreatedResponse({ type: UpiPaymentDto, description: 'Mock bank: pays the order through a signed callback. Off in production.' })
  simulateUpiPayment(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: SimulateUpiPaymentDto) {
    return this.pos.simulateUpiPayment(req.user.businessId, id, dto);
  }

  @Get('orders/:id/receipt.pdf')
  @Roles(...ALL)
  @ApiProduces('application/pdf')
  @ApiOkResponse({ description: 'Printable 80 mm receipt' })
  async receipt(@Req() req: AuthedRequest, @Param('id') id: string) {
    const { filename, pdf } = await this.pos.receipt(req.user.businessId, id);
    return new StreamableFile(pdf, { type: 'application/pdf', disposition: `inline; filename="${filename}"` });
  }

  @Post('orders/:id/receipt/send')
  @Roles(...SELL)
  @ApiCreatedResponse({ type: ReceiptDispatchDto, description: 'Mock WhatsApp/SMS send of the receipt; logged, nothing leaves the server' })
  sendReceipt(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: SendReceiptDto) {
    return this.pos.sendReceipt(req.user.businessId, id, dto);
  }

  @Post('sync')
  @Roles(...SELL)
  @ApiCreatedResponse({ type: PosSyncResultDto, description: 'Upload sales a till made offline. Safe to retry: already-synced sales come back as DUPLICATE.' })
  sync(@Req() req: AuthedRequest, @Body() dto: PosSyncDto) {
    return this.pos.sync(req.user.businessId, dto, req.user.id);
  }

  @Get('sync/conflicts')
  @Roles(...MONEY)
  @ApiOkResponse({ type: [SyncConflictDto], description: 'Latest 100 sync conflicts; ?status=OPEN for the ones needing a person' })
  findConflicts(@Req() req: AuthedRequest, @Query() query: ListConflictsQuery) {
    return this.pos.findConflicts(req.user.businessId, query);
  }

  @Post('sync/conflicts/:id/resolve')
  @Roles(...VOID)
  @ApiCreatedResponse({ type: SyncConflictDto, description: 'Mark an OPEN conflict as dealt with' })
  resolveConflict(@Req() req: AuthedRequest, @Param('id') id: string, @Body() dto: ResolveConflictDto) {
    return this.pos.resolveConflict(req.user.businessId, id, dto, req.user.id);
  }

  @Get('reconciliation')
  @Roles(...MONEY)
  @ApiOkResponse({ type: ReconciliationDto, description: 'UPI billed vs received for one day, with mismatches, failures and unpaid orders' })
  reconciliation(@Req() req: AuthedRequest, @Query() query: ReconciliationQuery) {
    return this.pos.reconciliation(req.user.businessId, query);
  }
}
