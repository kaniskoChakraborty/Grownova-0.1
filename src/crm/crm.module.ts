import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AccountingModule } from '../accounting/accounting.module';
import { GrowaiModule } from '../growai/growai.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { REMINDERS_QUEUE, RemindersProcessor } from './reminders.processor';

@Module({
  imports: [PrismaModule, AccountingModule, GrowaiModule, RealtimeModule, BullModule.registerQueue({ name: REMINDERS_QUEUE })],
  controllers: [LeadsController, InvoicesController],
  providers: [LeadsService, InvoicesService, RemindersProcessor],
  exports: [LeadsService], // the WhatsApp webhook creates leads through this
})
export class CrmModule {}
