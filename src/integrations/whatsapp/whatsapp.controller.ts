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
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppIntakeDto } from './dto/whatsapp-intake.dto';

@ApiBearerAuth()
@Controller('integrations/whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
export class WhatsAppController {
  constructor(
    private readonly whatsappService: WhatsAppService,
  ) {}

  @Post('intake')
  async intake(
    @Request() request: any,
    @Body() dto: WhatsAppIntakeDto,
  ) {
    return this.whatsappService.intake(request.user.businessId, dto);
  }
}
