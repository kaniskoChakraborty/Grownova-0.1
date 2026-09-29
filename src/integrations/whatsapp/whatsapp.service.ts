import { Injectable } from '@nestjs/common';

import { OnboardingService } from '../../onboarding/onboarding.service';
import { WhatsAppIntakeDto } from './dto/whatsapp-intake.dto';

@Injectable()
export class WhatsAppService {
  constructor(private readonly onboardingService: OnboardingService) {}

  // Maps a WhatsApp intake payload onto the standard onboarding flow.
  async intake(businessId: string, dto: WhatsAppIntakeDto) {
    return this.onboardingService.complete(
      businessId,
      {
        name: dto.businessName,
        industry: dto.industry,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
      },
      'whatsapp',
    );
  }
}
