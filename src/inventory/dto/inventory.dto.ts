import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StockMovementType } from '../../../generated/prisma/client';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsObject, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, ValidateNested } from 'class-validator';

const MAX_PRICE = 9_999_999_999.99; // Decimal(12,2)
const MAX_QTY = 999_999_999.999; // Decimal(12,3)
const BATCH_NO = /^[A-Za-z0-9._/-]{1,50}$/;
const BATCH_NO_MSG = 'batchNo must be 1-50 letters, digits or . _ / -';
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class CreateVariantDto {
  @ApiProperty({ example: 'RICE-BAS-5KG', description: 'Unique per business' })
  @Matches(/^[A-Za-z0-9._/-]{1,40}$/, { message: 'sku must be 1-40 letters, digits or . _ / -' })
  sku!: string;

  @ApiPropertyOptional({ example: '5 kg' })
  @IsOptional() @IsString() @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({ example: '8901234567890', description: 'EAN/UPC or your own code. Unique per business.' })
  @IsOptional() @Matches(/^[A-Za-z0-9-]{4,40}$/, { message: 'barcode must be 4-40 letters, digits or -' })
  barcode?: string;

  @ApiPropertyOptional({ example: { size: '5 kg' } })
  @IsOptional() @IsObject()
  attributes?: Record<string, string>;

  @ApiPropertyOptional({ example: 420, description: 'Rupees. Defaults to 0.' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(MAX_PRICE)
  costPrice?: number;

  @ApiPropertyOptional({ example: 499, description: 'Rupees. Defaults to 0.' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(MAX_PRICE)
  salePrice?: number;

  @ApiPropertyOptional({ example: 10, description: 'Alert when stock falls to this level' })
  @IsOptional() @IsInt() @Min(0)
  lowStockThreshold?: number;
}

export class UpdateVariantDto extends PartialType(CreateVariantDto) {
  @ApiPropertyOptional({ description: 'false archives the variant' })
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Basmati Rice' })
  @IsString() @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ example: '1006', description: 'See GET /gst/hsn for suggestions' })
  @IsOptional() @Matches(/^\d{4,8}$/, { message: 'hsnCode must be 4-8 digits' })
  hsnCode?: string;

  @ApiPropertyOptional({ example: 'pcs', default: 'pcs' })
  @IsOptional() @IsString() @MaxLength(20)
  unit?: string;

  @ApiProperty({ type: [CreateVariantDto], description: 'At least one. Use a single variant for products without sizes or colours.' })
  @ValidateNested({ each: true }) @Type(() => CreateVariantDto) @ArrayMinSize(1)
  variants!: CreateVariantDto[];
}

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['variants'] as const)) {
  @ApiPropertyOptional({ description: 'false archives the product' })
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}

export class ListProductsQuery {
  @ApiPropertyOptional({ description: 'Matches product name, variant SKU or barcode' })
  @IsOptional() @IsString() @MaxLength(80)
  q?: string;

  @ApiPropertyOptional({ description: 'Include archived products', default: false })
  @IsOptional() @IsIn(['true', 'false'])
  includeArchived?: string;
}

export class CreateLocationDto {
  @ApiProperty({ example: 'Main Shop' })
  @IsString() @MaxLength(80)
  name!: string;

  @ApiPropertyOptional({ example: 'Shop 12, Sadar Bazar, Delhi' })
  @IsOptional() @IsString() @MaxLength(300)
  address?: string;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @ApiPropertyOptional({ description: 'false archives the location' })
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}

/** Prices are decimal strings (e.g. "499.5") so no precision is lost in JSON. */
export class VariantResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() productId!: string;
  @ApiProperty({ example: 'RICE-BAS-5KG' }) sku!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) name!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) barcode!: string | null;
  @ApiPropertyOptional({ type: Object, nullable: true }) attributes!: Record<string, string> | null;
  @ApiProperty({ type: String, example: '420' }) costPrice!: string;
  @ApiProperty({ type: String, example: '499' }) salePrice!: string;
  @ApiPropertyOptional({ type: Number, nullable: true }) lowStockThreshold!: number | null;
  @ApiProperty() isActive!: boolean;
}

export class ProductResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) hsnCode!: string | null;
  @ApiProperty() unit!: string;
  @ApiProperty() isActive!: boolean;
  @ApiProperty({ type: [VariantResponseDto] }) variants!: VariantResponseDto[];
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
}

export class LocationResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) address!: string | null;
  @ApiProperty() isActive!: boolean;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
}

export class StockMovementDto {
  @ApiProperty() @IsUUID() variantId!: string;
  @ApiProperty() @IsUUID() locationId!: string;

  @ApiProperty({ enum: ['IN', 'OUT', 'ADJUST'], example: 'IN', description: 'IN adds stock, OUT removes it, ADJUST sets it to a physical count. Use /inventory/stock/transfers to move stock between locations.' })
  @IsIn(['IN', 'OUT', 'ADJUST'])
  type!: 'IN' | 'OUT' | 'ADJUST';

  @ApiProperty({ example: 25, description: 'IN/OUT: units moved (more than 0). ADJUST: the counted stock (0 or more). Up to 3 decimals for loose goods.' })
  @IsNumber({ maxDecimalPlaces: 3 }) @Min(0) @Max(MAX_QTY)
  quantity!: number;

  @ApiPropertyOptional({ example: 420, description: 'Rupees per unit. Defaults to the variant cost price.' })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(MAX_PRICE)
  unitCost?: number;

  @ApiPropertyOptional({ example: 'Bill 4471 from Sharma Traders' })
  @IsOptional() @IsString() @MaxLength(100)
  reference?: string;

  @ApiPropertyOptional({ example: '2 bags torn in transit' })
  @IsOptional() @IsString() @MaxLength(500)
  note?: string;

  @ApiPropertyOptional({
    example: 'B-2610',
    description: 'Batch or lot number. IN creates the batch the first time it is used; OUT and ADJUST need it to exist. ' +
      'OUT without a batchNo takes the soonest-expiring batches first. ADJUST with a batchNo sets that batch to the count.',
  })
  @IsOptional() @Matches(BATCH_NO, { message: BATCH_NO_MSG })
  batchNo?: string;

  @ApiPropertyOptional({ example: '2027-04-30', description: 'YYYY-MM-DD. Only on an IN with a batchNo.' })
  @IsOptional() @Matches(DATE, { message: 'expiryDate must be YYYY-MM-DD' }) @IsDateString({ strict: true })
  expiryDate?: string;

  @ApiPropertyOptional({ example: '2026-10-01', description: 'YYYY-MM-DD. Only on an IN with a batchNo.' })
  @IsOptional() @Matches(DATE, { message: 'mfgDate must be YYYY-MM-DD' }) @IsDateString({ strict: true })
  mfgDate?: string;
}

export class TransferItemDto {
  @ApiProperty() @IsUUID() variantId!: string;

  @ApiProperty({ example: 5, description: 'Units to move, more than 0, up to 3 decimals' })
  @IsNumber({ maxDecimalPlaces: 3 }) @Min(0.001) @Max(MAX_QTY)
  quantity!: number;

  @ApiPropertyOptional({ example: 'B-2610', description: 'Move only this batch. Without it the soonest-expiring batches go first.' })
  @IsOptional() @Matches(BATCH_NO, { message: BATCH_NO_MSG })
  batchNo?: string;
}

export class StockTransferDto {
  @ApiProperty() @IsUUID() fromLocationId!: string;
  @ApiProperty() @IsUUID() toLocationId!: string;

  @ApiProperty({ type: [TransferItemDto], description: '1-100 items, each variant once' })
  @ValidateNested({ each: true }) @Type(() => TransferItemDto) @ArrayMinSize(1) @ArrayMaxSize(100)
  @ArrayUnique((i: TransferItemDto) => i.variantId, { message: 'each variant can appear only once in a transfer' })
  items!: TransferItemDto[];

  @ApiPropertyOptional({ example: 'Challan 112' })
  @IsOptional() @IsString() @MaxLength(100)
  reference?: string;

  @ApiPropertyOptional({ example: 'Weekly refill for the shop' })
  @IsOptional() @IsString() @MaxLength(500)
  note?: string;
}

export class StockQuery {
  @ApiPropertyOptional() @IsOptional() @IsUUID() locationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() variantId?: string;
}

export class ListBatchesQuery {
  @ApiPropertyOptional() @IsOptional() @IsUUID() variantId?: string;
  @ApiPropertyOptional({ example: 'B-2610' }) @IsOptional() @Matches(BATCH_NO, { message: BATCH_NO_MSG }) batchNo?: string;
}

export class ExpiringBatchesQuery {
  @ApiPropertyOptional({ example: 30, default: 30, description: 'Window in days. Already expired batches with stock are always included.' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(365)
  days?: number;
}

class StockProductDto {
  @ApiProperty() name!: string;
  @ApiProperty() unit!: string;
}

class StockVariantDto {
  @ApiProperty() sku!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) name!: string | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) lowStockThreshold!: number | null;
  @ApiProperty({ type: StockProductDto }) product!: StockProductDto;
}

class StockLocationDto {
  @ApiProperty() name!: string;
}

class LedgerBatchDto {
  @ApiProperty({ example: 'B-2610' }) batchNo!: string;
  @ApiPropertyOptional({ type: String, format: 'date', nullable: true }) expiryDate!: Date | null;
}

/** Quantities are decimal strings (e.g. "12.5"). */
export class StockLevelDto {
  @ApiProperty() variantId!: string;
  @ApiProperty() locationId!: string;
  @ApiProperty({ type: String, example: '40' }) quantity!: string;
  @ApiProperty({ type: StockVariantDto }) variant!: StockVariantDto;
  @ApiProperty({ type: StockLocationDto }) location!: StockLocationDto;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt!: Date;
}

export class StockLedgerEntryDto {
  @ApiProperty() id!: string;
  @ApiProperty() variantId!: string;
  @ApiProperty() locationId!: string;
  @ApiProperty({ enum: StockMovementType }) type!: StockMovementType;
  @ApiProperty({ type: String, example: '-3', description: 'Signed change' }) quantity!: string;
  @ApiProperty({ type: String, example: '37', description: 'Stock at this location right after the change' }) balanceAfter!: string;
  @ApiProperty({ type: String, example: '420' }) unitCost!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) reference!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) note!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) actorId!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true, description: 'Links the rows of a transfer' }) transferId!: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) batchId!: string | null;
  @ApiPropertyOptional({ type: LedgerBatchDto, nullable: true }) batch!: LedgerBatchDto | null;
  @ApiProperty({ type: StockVariantDto }) variant!: StockVariantDto;
  @ApiProperty({ type: StockLocationDto }) location!: StockLocationDto;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
}

export class TransferResponseDto {
  @ApiProperty() transferId!: string;
  @ApiProperty({ type: [StockLedgerEntryDto], description: 'TRANSFER_OUT and TRANSFER_IN rows, one pair per item and batch moved' }) entries!: StockLedgerEntryDto[];
}

class BarcodeProductDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() unit!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) hsnCode!: string | null;
}

class BarcodeStockDto {
  @ApiProperty() locationId!: string;
  @ApiProperty({ type: String, example: '12' }) quantity!: string;
  @ApiProperty({ type: StockLocationDto }) location!: StockLocationDto;
}

export class BarcodeLookupDto extends VariantResponseDto {
  @ApiProperty({ type: BarcodeProductDto }) product!: BarcodeProductDto;
  @ApiProperty({ type: [BarcodeStockDto], description: 'Stock at each location that has ever held this variant' }) stockLevels!: BarcodeStockDto[];
}

class BatchVariantDto {
  @ApiProperty() sku!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) name!: string | null;
  @ApiProperty({ type: StockProductDto }) product!: StockProductDto;
}

class BatchStockDto {
  @ApiProperty() locationId!: string;
  @ApiProperty({ type: String, example: '12' }) quantity!: string;
  @ApiProperty({ type: StockLocationDto }) location!: StockLocationDto;
}

export class BatchDto {
  @ApiProperty() id!: string;
  @ApiProperty() variantId!: string;
  @ApiProperty({ example: 'B-2610' }) batchNo!: string;
  @ApiPropertyOptional({ type: String, format: 'date', nullable: true }) mfgDate!: Date | null;
  @ApiPropertyOptional({ type: String, format: 'date', nullable: true }) expiryDate!: Date | null;
  @ApiProperty({ type: BatchVariantDto }) variant!: BatchVariantDto;
  @ApiProperty({ type: [BatchStockDto], description: 'Locations where this batch has stock now' }) stocks!: BatchStockDto[];
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
}

export class ExpiringBatchDto extends BatchDto {
  @ApiProperty({ example: 12, description: 'Days until expiry (UTC date); negative once expired' }) daysLeft!: number;
  @ApiProperty({ type: String, example: '18', description: 'Total stock of this batch across locations' }) quantity!: string;
}

export class BatchTraceDto extends BatchDto {
  @ApiProperty({ type: [StockLedgerEntryDto], description: 'Every movement of this batch, oldest first' }) ledger!: StockLedgerEntryDto[];
}
