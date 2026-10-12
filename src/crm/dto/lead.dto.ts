import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { LeadStatus } from '../../../generated/prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

// source, rawMessage and businessId are deliberately NOT client-settable.
export class CreateLeadDto {
  @ApiPropertyOptional({ example: 'Ramesh Traders' })
  @IsOptional() @IsString() @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional() @Matches(/^\+?\d{10,15}$/, { message: 'phone must be 10-15 digits with an optional leading +' })
  phone?: string;

  @ApiPropertyOptional({ example: 'ramesh@example.com' })
  @IsOptional() @IsEmail()
  email?: string;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional() @IsString() @MaxLength(2000)
  notes?: string;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsOptional() @IsEnum(LeadStatus)
  status?: LeadStatus;
}

export class ListLeadsQuery {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsOptional() @IsEnum(LeadStatus)
  status?: LeadStatus;
}
