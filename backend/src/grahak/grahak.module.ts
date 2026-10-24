import { Module } from '@nestjs/common';
import { GrahakController } from './grahak.controller';
import { GrahakService } from './grahak.service';

@Module({
  controllers: [GrahakController],
  providers: [GrahakService],
  exports: [GrahakService],
})
export class GrahakModule {}
