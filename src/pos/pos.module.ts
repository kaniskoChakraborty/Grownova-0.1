import { Module } from '@nestjs/common';
import { AccountingModule } from '../accounting/accounting.module';
import { InventoryModule } from '../inventory/inventory.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { UpiController } from './upi.controller';

@Module({
  imports: [PrismaModule, RealtimeModule, InventoryModule, AccountingModule],
  controllers: [PosController, UpiController],
  providers: [PosService],
})
export class PosModule {}
