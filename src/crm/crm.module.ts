import { Module } from '@nestjs/common';
import { GrowaiModule } from '../growai/growai.module';
import { PrismaModule } from '../prisma/prisma.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [PrismaModule, GrowaiModule],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService], // the WhatsApp webhook creates leads through this
})
export class CrmModule {}
