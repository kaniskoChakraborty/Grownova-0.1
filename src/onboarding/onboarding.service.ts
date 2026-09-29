import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  INDUSTRY_UI_PRESET,
  OnboardingResponse,
} from '../common/contracts';
import { OnboardingDto } from './dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async complete(
    businessId: string,
    dto: OnboardingDto,
    channel: OnboardingResponse['channel'] = 'web',
  ): Promise<OnboardingResponse> {
    const business = await this.prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const updatedBusiness = await this.prisma.business.update({
      where: {
        id: businessId,
      },
      data: {
        name: dto.name,
        industry: dto.industry,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country ?? 'India',
      },
    });

    return {
      onboardingCompleted: true,
      channel,
      uiPreset: INDUSTRY_UI_PRESET[dto.industry],
      business: {
        id: updatedBusiness.id,
        name: updatedBusiness.name,
        industry: updatedBusiness.industry,
        phone: updatedBusiness.phone,
        email: updatedBusiness.email,
        address: updatedBusiness.address,
        city: updatedBusiness.city,
        state: updatedBusiness.state,
        country: updatedBusiness.country,
      },
    };
  }
}
