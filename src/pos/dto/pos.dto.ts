import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PosOrderStatus, SyncConflictStatus, SyncConflictType, UpiCallbackResult } from '../../../generated/prisma/client';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsDateString, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, ValidateNested } from 'class-validator';

const MAX_PRICE = 9_999_999_999.99; // Decimal(12,2)
const MAX_QTY = 999_999_999.999; // Decimal(12,3)

export class PosOrderItemDto {
  @ApiProperty() @IsUUID() variantId!: string;

  @ApiProperty({ example: 2, description: 'Units sold, up to 3 decimals for loose goods' })
  @IsNumber({ maxDecimalPlaces: 3 }) @Min(0.001) @Max(MAX_QTY)
  quantity!: number;

  @ApiPropertyOptional({ example: 499, description: 'Rupees per unit, GST included. Defaults to the variant sale price.' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(MAX_PRICE)
  unitPrice?: number;
}

export class CreatePosOrderDto {
  @ApiProperty({ description: 'Shop the sale happens at; stock leaves this location' }) @IsUUID() locationId!: string;

  @ApiProperty({ enum: ['CASH', 'UPI', 'CARD'], example: 'CASH', description: 'CASH and CARD are paid at once; UPI waits for the bank callback' })
  @IsIn(['CASH', 'UPI', 'CARD'])
  paymentMethod!: 'CASH' | 'UPI' | 'CARD';

  @ApiProperty({ type: [PosOrderItemDto], description: '1-100 items, each variant once' })
  @ValidateNested({ each: true }) @Type(() => PosOrderItemDto) @ArrayMinSize(1) @ArrayMaxSize(100)
  @ArrayUnique((i: PosOrderItemDto) => i.variantId, { message: 'each variant can appear only once in items' })
  items!: PosOrderItemDto[];

  @ApiPropertyOptional({ example: 'Sita Devi' }) @IsOptional() @IsString() @MaxLength(120) customerName?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional() @Matches(/^\+?\d{10,15}$/, { message: 'customerPhone must be 10-15 digits' })
  customerPhone?: string;
}

export class CancelPosOrderDto {
  @ApiPropertyOptional({ example: 'Customer changed their mind' }) @IsOptional() @IsString() @MaxLength(200) reason?: string;
}

export class UpiCallbackDto {
  @ApiProperty({ example: 'GN3F9A1C2B4D5E6F70', description: 'tr= from the UPI link' })
  @Matches(/^[A-Za-z0-9]{1,35}$/, { message: 'txnRef must be 1-35 letters or digits' })
  txnRef!: string;

  @ApiProperty({ example: '612345678901', description: '12-digit bank reference (UTR/RRN)' })
  @Matches(/^\d{12}$/, { message: 'utr must be 12 digits' })
  utr!: string;

  @ApiProperty({ example: 499 }) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01) @Max(MAX_PRICE) amount!: number;
  @ApiProperty({ enum: ['SUCCESS', 'FAILED'] }) @IsIn(['SUCCESS', 'FAILED']) status!: 'SUCCESS' | 'FAILED';
  @ApiPropertyOptional({ example: 'sita@okaxis' }) @IsOptional() @IsString() @MaxLength(256) payerVpa?: string;
}

export class SimulateUpiPaymentDto {
  @ApiPropertyOptional({ example: 499, description: 'Defaults to the order total. Send a different amount to see a mismatch.' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01) @Max(MAX_PRICE)
  amount?: number;

  @ApiPropertyOptional({ enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' }) @IsOptional() @IsIn(['SUCCESS', 'FAILED']) status?: 'SUCCESS' | 'FAILED';
}

export class SendReceiptDto {
  @ApiPropertyOptional({ enum: ['WHATSAPP', 'SMS'], default: 'WHATSAPP' }) @IsOptional() @IsIn(['WHATSAPP', 'SMS']) channel?: 'WHATSAPP' | 'SMS';

  @ApiPropertyOptional({ example: '+919876543210', description: "Defaults to the order's customerPhone" })
  @IsOptional() @Matches(/^\+?\d{10,15}$/, { message: 'to must be 10-15 digits' })
  to?: string;
}

export class EwayBillDto {
  @ApiProperty({ example: 'Sharma Traders' }) @IsString() @MaxLength(100) toName!: string;

  @ApiPropertyOptional({ example: '09AAACS1234B1Z2', description: 'Leave out for an unregistered buyer (URP)' })
  @IsOptional() @Matches(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, { message: 'toGstin is not a valid GSTIN' })
  toGstin?: string;

  @ApiProperty({ example: 'Noida, Uttar Pradesh' }) @IsString() @MaxLength(100) toPlace!: string;
  @ApiProperty({ example: '201301' }) @Matches(/^[1-9]\d{5}$/, { message: 'toPincode must be 6 digits' }) toPincode!: string;
  @ApiProperty({ example: 35, description: 'Road distance in km; sets how long the bill is valid (1 day per 200 km)' }) @IsInt() @Min(1) @Max(4000) distanceKm!: number;
  @ApiProperty({ example: 'DL01AB1234' }) @IsString() @MaxLength(15) vehicleNo!: string;
}

export class SyncOrderDto extends CreatePosOrderDto {
  @ApiProperty({ description: "The till's own id for this sale (a UUID it made offline); syncing it again is a no-op" }) @IsUUID() clientId!: string;

  @ApiProperty({ example: '2026-10-19T09:15:00+05:30', description: 'When the sale happened. Up to 30 days ago.' })
  @IsDateString({ strict: true })
  soldAt!: string;
}

export class PosSyncDto {
  @ApiProperty({ example: 'till-1', description: 'Which till is uploading' })
  @Matches(/^[\w.:-]{1,64}$/, { message: 'deviceId must be 1-64 letters, digits or _ . : -' })
  deviceId!: string;

  @ApiProperty({ type: [SyncOrderDto], description: '1-100 offline sales' })
  @ValidateNested({ each: true }) @Type(() => SyncOrderDto) @ArrayMinSize(1) @ArrayMaxSize(100)
  @ArrayUnique((o: SyncOrderDto) => o.clientId, { message: 'each clientId can appear only once' })
  orders!: SyncOrderDto[];
}

export class ListConflictsQuery {
  @ApiPropertyOptional({ enum: SyncConflictStatus, example: 'OPEN' }) @IsOptional() @IsEnum(SyncConflictStatus) status?: SyncConflictStatus;
}

export class ResolveConflictDto {
  @ApiPropertyOptional({ example: 'Recounted Godown 1, adjusted stock' }) @IsOptional() @IsString() @MaxLength(500) note?: string;
}

export class ReconciliationQuery {
  @ApiPropertyOptional({ example: '2026-10-19', description: 'YYYY-MM-DD, India time. Defaults to today.' })
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' }) @IsDateString({ strict: true })
  date?: string;
}

export class ListPosOrdersQuery {
  @ApiPropertyOptional({ enum: PosOrderStatus }) @IsOptional() @IsEnum(PosOrderStatus) status?: PosOrderStatus;
  @ApiPropertyOptional() @IsOptional() @IsUUID() locationId?: string;
}

class PosLineVariantDto {
  @ApiProperty() sku!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) name!: string | null;
  @ApiProperty({ example: { name: 'Basmati Rice', unit: 'pcs' } }) product!: { name: string; unit: string };
}

class PosOrderLineDto {
  @ApiProperty() id!: string;
  @ApiProperty() variantId!: string;
  @ApiProperty({ type: String, example: '2' }) quantity!: string;
  @ApiProperty({ type: String, example: '499' }) unitPrice!: string;
  @ApiProperty({ type: String, example: '998' }) lineTotal!: string;
  @ApiProperty({ type: PosLineVariantDto }) variant!: PosLineVariantDto;
}

export class PosOrderDto {
  @ApiProperty() id!: string;
  @ApiProperty({ example: 'POS/26-27/000001' }) number!: string;
  @ApiProperty() locationId!: string;
  @ApiProperty({ example: { name: 'Main Shop' } }) location!: { name: string };
  @ApiProperty({ enum: PosOrderStatus }) status!: PosOrderStatus;
  @ApiProperty({ enum: ['CASH', 'UPI', 'CARD'] }) paymentMethod!: string;
  @ApiProperty({ type: String, example: '998' }) total!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) customerName!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) customerPhone!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) idempotencyKey!: string | null;
  @ApiPropertyOptional({ type: Date, nullable: true }) paidAt!: Date | null;
  @ApiPropertyOptional({ type: Date, nullable: true }) cancelledAt!: Date | null;
  @ApiPropertyOptional({ type: String, nullable: true }) cancelReason!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true, example: '331234567890' }) ewbNo!: string | null;
  @ApiPropertyOptional({ type: Date, nullable: true }) ewbDate!: Date | null;
  @ApiPropertyOptional({ type: Date, nullable: true }) ewbValidUntil!: Date | null;
  @ApiPropertyOptional({ type: Object, nullable: true }) ewb!: object | null;
  @ApiProperty() createdAt!: Date;
  @ApiProperty({ type: [PosOrderLineDto] }) lines!: PosOrderLineDto[];
}

export class UpiLinkDto {
  @ApiProperty() orderId!: string;
  @ApiProperty({ example: 'POS/26-27/000002' }) number!: string;
  @ApiProperty({ example: 'GN3F9A1C2B4D5E6F70' }) txnRef!: string;
  @ApiProperty({ example: '499.00' }) amount!: string;
  @ApiProperty({ example: 'myshop@okicici' }) vpa!: string;
  @ApiProperty({ example: 'upi://pay?pa=myshop@okicici&pn=Demo%20Store&am=499.00&cu=INR&tr=GN3F9A1C2B4D5E6F70&tn=POS%2F26-27%2F000002', description: 'Draw this as a QR code; any UPI app can scan it' })
  upiLink!: string;
}

export class UpiPaymentDto {
  @ApiProperty() id!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) orderId!: string | null;
  @ApiProperty() txnRef!: string;
  @ApiProperty() utr!: string;
  @ApiProperty({ type: String, example: '499' }) amount!: string;
  @ApiProperty({ example: 'SUCCESS' }) status!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) payerVpa!: string | null;
  @ApiProperty({ enum: UpiCallbackResult }) result!: UpiCallbackResult;
  @ApiProperty() receivedAt!: Date;
}

class ReconOrderDto {
  @ApiProperty() id!: string;
  @ApiProperty() number!: string;
  @ApiProperty({ type: String }) total!: string;
  @ApiProperty({ enum: PosOrderStatus }) status!: PosOrderStatus;
}

export class ReconciliationDto {
  @ApiProperty({ example: '2026-10-19' }) date!: string;
  @ApiProperty({ type: String, example: '1497', description: 'UPI orders raised that day, cancelled ones left out' }) expected!: string;
  @ApiProperty({ type: String, example: '998', description: 'Successful UPI money received that day' }) received!: string;
  @ApiProperty({ type: String, example: '-499', description: 'received - expected' }) difference!: string;
  @ApiProperty({ type: [UpiPaymentDto] }) matched!: UpiPaymentDto[];
  @ApiProperty({ type: [UpiPaymentDto], description: 'Money that came in but could not settle an order: wrong amount, or the order was already paid or cancelled' }) exceptions!: UpiPaymentDto[];
  @ApiProperty({ type: [UpiPaymentDto] }) failed!: UpiPaymentDto[];
  @ApiProperty({ type: [ReconOrderDto], description: 'UPI orders from that day still waiting for payment' }) pending!: ReconOrderDto[];
}

export class ReceiptDispatchDto {
  @ApiProperty() messageId!: string;
  @ApiProperty({ enum: ['WHATSAPP', 'SMS'] }) channel!: string;
  @ApiProperty({ example: '+919876543210' }) to!: string;
  @ApiProperty({ example: 'SENT' }) status!: string;
  @ApiProperty({ example: 'mock' }) provider!: string;
  @ApiProperty({ example: 'GrowNova Demo: receipt POS/26-27/000001, total Rs. 499.00. Thank you!' }) text!: string;
  @ApiProperty({ example: { filename: 'POS-26-27-000001.pdf', bytes: 1234 } }) attachment!: { filename: string; bytes: number };
}

export class SyncConflictDto {
  @ApiProperty() id!: string;
  @ApiProperty() deviceId!: string;
  @ApiProperty() clientId!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) orderId!: string | null;
  @ApiProperty({ enum: SyncConflictType }) type!: SyncConflictType;
  @ApiProperty({ enum: SyncConflictStatus }) status!: SyncConflictStatus;
  @ApiProperty({ example: { sku: 'RICE-BAS-5KG', sold: '3', deducted: '1', short: '2' } }) detail!: object;
  @ApiPropertyOptional({ type: String, nullable: true }) note!: string | null;
  @ApiPropertyOptional({ type: Date, nullable: true }) resolvedAt!: Date | null;
  @ApiProperty() createdAt!: Date;
}

class SyncResultDto {
  @ApiProperty() clientId!: string;
  @ApiProperty({ enum: ['ACCEPTED', 'MERGED', 'DUPLICATE', 'REJECTED'], description: 'MERGED = booked, with a rule applied (see conflicts)' }) result!: string;
  @ApiPropertyOptional() orderId?: string;
  @ApiPropertyOptional({ example: 'POS/26-27/000003' }) number?: string;
  @ApiPropertyOptional() error?: string;
  @ApiProperty({ type: [SyncConflictDto] }) conflicts!: SyncConflictDto[];
}

export class PosSyncResultDto {
  @ApiProperty() deviceId!: string;
  @ApiProperty({ type: [SyncResultDto], description: 'One per sale, oldest first' }) results!: SyncResultDto[];
}
