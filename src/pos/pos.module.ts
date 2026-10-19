import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { UpiController } from './upi.controller';

@Module({
  imports: [PrismaModule, RealtimeModule, InventoryModule],
  controllers: [PosController, UpiController],
  providers: [PosService],
})
export class PosModule {}
