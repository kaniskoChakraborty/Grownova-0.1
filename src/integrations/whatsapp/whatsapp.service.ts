import { Injectable } from '@nestjs/common';
import { OnboardingService } from '../../onboarding/onboarding.service';
import { WhatsAppIntakeDto } from './dto/whatsapp-intake.dto';
import { WhatsAppWebhookDto } from './dto/whatsapp-webhook.dto';

@Injectable()
export class WhatsAppService {
  constructor(
    private readonly onboardingService: OnboardingService,
  ) {}

  async intake(businessId: string, dto: WhatsAppIntakeDto) {
    return this.onboardingService.complete(businessId, {
      name: dto.businessName,
      industry: dto.industry,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      country: dto.country,
    });
  }

  async webhook(businessId: string, dto: WhatsAppWebhookDto) {
    return {
      accepted: true,
      channel: 'whatsapp',
      businessId,
      message: {
        phone: dto.phone,
        senderName: dto.senderName,
        text: dto.message,
      },
    };
  }
}
