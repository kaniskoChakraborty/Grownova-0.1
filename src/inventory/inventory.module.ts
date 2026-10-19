import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { ExpiryProcessor, INVENTORY_QUEUE } from './expiry.processor';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [PrismaModule, RealtimeModule, BullModule.registerQueue({ name: INVENTORY_QUEUE })],
  controllers: [InventoryController],
  providers: [InventoryService, ExpiryProcessor],
  exports: [InventoryService],
})
export class InventoryModule {}
