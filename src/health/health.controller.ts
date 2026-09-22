import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService, HealthResponse } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  check(): HealthResponse {
    return this.healthService.check();
  }
}
