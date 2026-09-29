import { Module } from '@nestjs/common';

import { OnboardingModule } from '../../onboarding/onboarding.module';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';

@Module({
  imports: [OnboardingModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
})
export class WhatsAppModule {}
