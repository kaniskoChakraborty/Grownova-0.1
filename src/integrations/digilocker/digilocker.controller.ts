import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../../generated/prisma/client';
import { DigilockerAdapter } from './digilocker.adapter';
import { DigilockerConsentDto, DigilockerKycDto } from './dto/digilocker.dto';

@ApiBearerAuth()
@Controller('integrations/digilocker')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
export class DigilockerController {
  constructor(private readonly digilocker: DigilockerAdapter) {}

  @Post('consent')
  async consent(
    @Request() request: any,
    @Body() dto: DigilockerConsentDto,
  ) {
    return this.digilocker.requestConsent(
      request.user.businessId,
      dto.documentType,
    );
  }

  @Post('kyc')
  async kyc(@Request() request: any, @Body() dto: DigilockerKycDto) {
    return this.digilocker.verifyKyc(request.user.businessId, dto.consentId);
  }
}
