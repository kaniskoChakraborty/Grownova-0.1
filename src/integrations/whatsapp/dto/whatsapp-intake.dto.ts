import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { INDUSTRIES, Industry } from '../../../common/contracts';

export class WhatsAppIntakeDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  businessName: string;

  @IsIn(INDUSTRIES)
  industry: Industry;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  senderName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4096)
  message?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}
