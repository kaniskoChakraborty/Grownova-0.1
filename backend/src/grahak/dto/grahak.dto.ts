import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  role?: 'MERCHANT' | 'CUSTOMER';
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  otp!: string;
}

export class RegisterAccountDto {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  shopName?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsString()
  gstin?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  role?: 'MERCHANT' | 'CUSTOMER';
}

export class BillItemDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice!: number;

  @IsOptional()
  @IsNumber()
  gstRate?: number;
}

export class CreateBillDto {
  @IsNotEmpty()
  @IsString()
  storeId!: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillItemDto)
  items!: BillItemDto[];

  @IsNotEmpty()
  @IsString()
  paymentMode!: 'CASH' | 'UPI' | 'UDHAAR' | 'CARD';

  @IsOptional()
  @IsNumber()
  discount?: number;
}

export class KhataTransactionDto {
  @IsNotEmpty()
  @IsString()
  storeId!: string;

  @IsNotEmpty()
  @IsString()
  customerPhone!: string;

  @IsNotEmpty()
  @IsString()
  customerName!: string;

  @IsNotEmpty()
  @IsString()
  type!: 'GAVE_CREDIT' | 'GOT_PAYMENT'; // Udhaar vs Jama

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AttendanceRecordDto {
  @IsNotEmpty()
  @IsString()
  storeId!: string;

  @IsNotEmpty()
  @IsString()
  staffName!: string;

  @IsNotEmpty()
  @IsNumber()
  latitude!: number;

  @IsNotEmpty()
  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class InventoryScanDto {
  @IsNotEmpty()
  @IsString()
  storeId!: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  photoBase64?: string;
}
