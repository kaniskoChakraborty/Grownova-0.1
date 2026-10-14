import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus, LeadStatus, PaymentMethod } from '../../../generated/prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Max, MaxLength } from 'class-validator';

const MAX_AMOUNT = 9_999_999_999.99; // Decimal(12,2)

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Lead being billed' })
  @IsUUID()
  leadId!: string;

  @ApiProperty({ example: 25000, description: 'Invoice total in rupees, up to 2 decimals' })
  @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() @Max(MAX_AMOUNT)
  total!: number;

  @ApiPropertyOptional({ example: '2026-11-12', description: 'Defaults to 30 days from today' })
  @IsOptional() @IsDateString()
  dueDate?: string;
}

export class RecordPaymentDto {
  @ApiProperty({ example: 10000, description: 'Rupees. Cannot exceed what is still owed.' })
  @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() @Max(MAX_AMOUNT)
  amount!: number;

  @ApiProperty({ enum: PaymentMethod, example: 'UPI' })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiPropertyOptional({ example: 'UPI ref 4321098765' })
  @IsOptional() @IsString() @MaxLength(100)
  reference?: string;
}

export class ListInvoicesQuery {
  @ApiPropertyOptional() @IsOptional() @IsUUID() leadId?: string;
  @ApiPropertyOptional({ enum: InvoiceStatus }) @IsOptional() @IsEnum(InvoiceStatus) status?: InvoiceStatus;
}

export class InvoicePaymentDto {
  @ApiProperty() id!: string;
  @ApiProperty({ type: String, example: '10000' }) amount!: string;
  @ApiProperty({ enum: PaymentMethod }) method!: PaymentMethod;
  @ApiPropertyOptional({ type: String, nullable: true }) reference!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) recordedById!: string | null;
  @ApiProperty({ type: String, format: 'date-time' }) paidAt!: Date;
}

class InvoiceLeadDto {
  @ApiProperty() id!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) name!: string | null;
  @ApiProperty({ enum: LeadStatus }) status!: LeadStatus;
}

/** Money fields are decimal strings (e.g. "25000.5") so no precision is lost in JSON. */
export class InvoiceResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty({ example: 'INV-0001' }) number!: string;
  @ApiProperty() leadId!: string;
  @ApiProperty({ type: String, example: '25000' }) total!: string;
  @ApiProperty({ type: String, example: '10000' }) amountPaid!: string;
  @ApiProperty({ enum: InvoiceStatus }) status!: InvoiceStatus;
  @ApiProperty({ type: String, format: 'date-time' }) dueDate!: Date;
  @ApiPropertyOptional({ type: String, nullable: true, description: 'GST e-invoice reference, set by POST /crm/invoices/:id/irn' }) irn!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true, example: '112610000123456' }) ackNo!: string | null;
  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true }) ackDate!: Date | null;
  @ApiProperty({ type: InvoiceLeadDto }) lead!: InvoiceLeadDto;
  @ApiProperty({ type: [InvoicePaymentDto] }) payments!: InvoicePaymentDto[];
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
}
