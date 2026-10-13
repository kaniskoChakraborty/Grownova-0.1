import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { GrowaiModule } from '../growai/growai.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { REMINDERS_QUEUE, RemindersProcessor } from './reminders.processor';

@Module({
  imports: [PrismaModule, GrowaiModule, RealtimeModule, BullModule.registerQueue({ name: REMINDERS_QUEUE })],
  controllers: [LeadsController],
  providers: [LeadsService, RemindersProcessor],
  exports: [LeadsService], // the WhatsApp webhook creates leads through this
})
export class CrmModule {}
