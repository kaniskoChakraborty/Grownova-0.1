import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditService } from './audit.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post('test')
  async test(@Request() request: any) {
    return this.auditService.create({
      businessId: request.user.businessId,
      actorId: request.user.id,
      action: 'TEST',
      entity: 'AuditLog',
      metadata: {
        source: 'phase-5-test',
      },
    });
  }

  @Get('integrity')
  async integrity(@Request() request: any) {
    return this.auditService.verifyIntegrity(
      request.user.businessId,
    );
  }
}
