import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsUUID,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  businessId: string;
}
