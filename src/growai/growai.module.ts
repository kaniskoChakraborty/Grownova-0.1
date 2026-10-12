import { Module } from '@nestjs/common';
import { GrowaiService } from './growai.service';
import { LlmService } from './llm.service';

@Module({
  providers: [LlmService, GrowaiService],
  exports: [GrowaiService],
})
export class GrowaiModule {}
