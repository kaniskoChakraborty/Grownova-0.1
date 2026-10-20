import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AccountType, JournalSource } from '../../../generated/prisma/client';
import { ArrayMaxSize, ArrayMinSize, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';

const MAX_AMOUNT = 999_999_999_999.99; // Decimal(14,2)
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export class CreateAccountDto {
  @ApiProperty({ example: '5950', description: '3-10 digits; unique in the business' }) @Matches(/^\d{3,10}$/, { message: 'code must be 3-10 digits' }) code!: string;
  @ApiProperty({ example: 'Office Supplies' }) @IsString() @MinLength(2) @MaxLength(100) name!: string;
  @ApiProperty({ enum: AccountType, example: 'EXPENSE' }) @IsEnum(AccountType) type!: AccountType;
}

export class UpdateAccountDto {
  @ApiPropertyOptional({ example: 'Stationery' }) @IsOptional() @IsString() @MinLength(2) @MaxLength(100) name?: string;
  @ApiPropertyOptional({ description: 'false archives the account; seeded accounts cannot be archived' }) @IsOptional() @IsBoolean() isActive?: boolean;
}

export class ListAccountsQuery {
  @ApiPropertyOptional({ enum: AccountType }) @IsOptional() @IsEnum(AccountType) type?: AccountType;
}

export class JournalLineInput {
  @ApiProperty() @IsUUID() accountId!: string;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(MAX_AMOUNT)
  debit?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(MAX_AMOUNT)
  credit?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) note?: string;
}

export class CreateJournalDto {
  @ApiPropertyOptional({ example: '2026-10-19', description: 'Accounting date, YYYY-MM-DD India time. Defaults to today; cannot be in the future.' })
  @IsOptional() @Matches(DAY, { message: 'date must be YYYY-MM-DD' }) @IsDateString({ strict: true })
  date?: string;

  @ApiProperty({ example: 'October shop rent paid by bank' }) @IsString() @MinLength(2) @MaxLength(500) narration!: string;

  @ApiProperty({ type: [JournalLineInput], description: '2-100 lines; each a debit or a credit; debits must equal credits' })
  @ValidateNested({ each: true }) @Type(() => JournalLineInput) @ArrayMinSize(2) @ArrayMaxSize(100)
  lines!: JournalLineInput[];
}

export class ReverseJournalDto {
  @ApiProperty({ example: 'Wrong account; re-posted as JV/26-27/000003' }) @IsString() @MinLength(2) @MaxLength(500) reason!: string;

  @ApiPropertyOptional({ example: '2026-10-19', description: 'Date of the reversal. Defaults to today.' })
  @IsOptional() @Matches(DAY, { message: 'date must be YYYY-MM-DD' }) @IsDateString({ strict: true })
  date?: string;
}

export class ListJournalsQuery {
  @ApiPropertyOptional({ example: '2026-10-01' }) @IsOptional() @Matches(DAY, { message: 'from must be YYYY-MM-DD' }) @IsDateString({ strict: true }) from?: string;
  @ApiPropertyOptional({ example: '2026-10-31' }) @IsOptional() @Matches(DAY, { message: 'to must be YYYY-MM-DD' }) @IsDateString({ strict: true }) to?: string;
  @ApiPropertyOptional({ description: 'Only journals touching this account' }) @IsOptional() @IsUUID() accountId?: string;
}

export class LedgerQuery {
  @ApiPropertyOptional({ example: '2026-04-01', description: 'Defaults to the start of the current financial year' }) @IsOptional() @Matches(DAY, { message: 'from must be YYYY-MM-DD' }) @IsDateString({ strict: true }) from?: string;
  @ApiPropertyOptional({ example: '2026-10-31', description: 'Defaults to today' }) @IsOptional() @Matches(DAY, { message: 'to must be YYYY-MM-DD' }) @IsDateString({ strict: true }) to?: string;
}

export class TrialBalanceQuery {
  @ApiPropertyOptional({ example: '2026-10-31', description: 'Balances at the end of this day; defaults to today' }) @IsOptional() @Matches(DAY, { message: 'asOf must be YYYY-MM-DD' }) @IsDateString({ strict: true }) asOf?: string;
}

export class AccountDto {
  @ApiProperty() id!: string;
  @ApiProperty({ example: '1000' }) code!: string;
  @ApiProperty({ example: 'Cash in Hand' }) name!: string;
  @ApiProperty({ enum: AccountType }) type!: AccountType;
  @ApiProperty() isSystem!: boolean;
  @ApiProperty() isActive!: boolean;
}

class JournalLineDto {
  @ApiProperty() accountId!: string;
  @ApiProperty({ example: { code: '5300', name: 'Rent' } }) account!: { code: string; name: string };
  @ApiProperty({ type: String, example: '15000' }) debit!: string;
  @ApiProperty({ type: String, example: '0' }) credit!: string;
  @ApiPropertyOptional({ type: String, nullable: true }) note!: string | null;
}

export class JournalDto {
  @ApiProperty() id!: string;
  @ApiProperty({ example: 'JV/26-27/000001' }) number!: string;
  @ApiProperty({ example: '2026-10-19' }) date!: Date;
  @ApiProperty() narration!: string;
  @ApiProperty({ type: String, example: '15000' }) total!: string;
  @ApiProperty({ enum: JournalSource }) source!: JournalSource;
  @ApiPropertyOptional({ type: String, nullable: true, description: 'Set on a reversal: the journal it cancels' }) reversalOfId!: string | null;
  @ApiPropertyOptional({ type: Object, nullable: true, description: 'Set when this journal has been reversed', example: { id: '…', number: 'JV/26-27/000002' } }) reversedBy!: { id: string; number: string } | null;
  @ApiProperty() createdAt!: Date;
  @ApiProperty({ type: [JournalLineDto] }) lines!: JournalLineDto[];
}
