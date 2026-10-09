import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

// Mock inbound WhatsApp message (mirrors the fields the real Cloud API sends).
export class WhatsAppWebhookDto {
  @ApiProperty({ example: '919876543210', description: 'Sender number, as WhatsApp sends it' })
  @Matches(/^\+?\d{10,15}$/, { message: 'from must be 10-15 digits with an optional leading +' })
  from!: string;

  @ApiProperty({ example: 'Hi, my name is Ramesh Kumar. Need rate for 50 boxes.' })
  @IsString() @IsNotEmpty() @MaxLength(4000)
  text!: string;

  @ApiPropertyOptional({ example: 'Ramesh K', description: 'WhatsApp profile name; used if the text has no name' })
  @IsOptional() @IsString() @MaxLength(120)
  profileName?: string;
}
