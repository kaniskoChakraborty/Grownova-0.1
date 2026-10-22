import { CrmModule } from '../../crm/crm.module';
import { Module } from '@nestjs/common';

import { OnboardingModule } from '../../onboarding/onboarding.module';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';

@Module({
  imports: [CrmModule, OnboardingModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
})
export class WhatsAppModule {}
