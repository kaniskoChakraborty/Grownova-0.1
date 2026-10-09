import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class WhatsAppWebhookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  senderName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message: string;
}
