import { Injectable } from '@nestjs/common';

export interface HealthResponse {
  status: string;
  service: string;
}

@Injectable()
export class HealthService {
  check(): HealthResponse {
    return {
      status: 'ok',
      service: 'grownova-api',
    };
  }
}
