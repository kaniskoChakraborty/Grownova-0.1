import { Injectable } from '@nestjs/common';
import { OnboardingService } from '../../onboarding/onboarding.service';
import { WhatsAppIntakeDto } from './dto/whatsapp-intake.dto';
import { WhatsAppWebhookDto } from './dto/whatsapp-webhook.dto';
import { LeadsService } from '../../crm/leads.service';
import { parseLeadMessage } from '../../crm/lead-parser';

@Injectable()
export class WhatsAppService {
  constructor(
    private readonly leadsService: LeadsService,
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
    }, 'whatsapp');
  }

  // Phase 8: inbound WhatsApp message -> parsed CRM lead.
  async webhook(businessId: string, dto: WhatsAppWebhookDto) {
    const parsed = parseLeadMessage(dto.text, dto.from);
    const lead = await this.leadsService.createFromWhatsApp(
      businessId,
      { ...parsed, name: parsed.name ?? dto.profileName },
      dto.text,
    );
    return { accepted: true, channel: 'whatsapp', lead };
  }
}
