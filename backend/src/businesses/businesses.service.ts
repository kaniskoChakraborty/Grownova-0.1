import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    industry?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  }) {
    return this.prisma.business.create({
      data: {
        name: data.name,
        industry: data.industry,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country ?? 'India',
      },
    });
  }

  async findById(id: string, businessId: string) {
    if (id !== businessId) {
      throw new NotFoundException('Business not found');
    }

    const business = await this.prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async findAll(businessId: string) {
    return this.prisma.business.findMany({
      where: {
        id: businessId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

 async update(
  id: string,
  businessId: string,
  data: {
    name?: string;
    industry?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  },
) {
  if (id !== businessId) {
    throw new NotFoundException('Business not found');
  }

  const business = await this.prisma.business.findUnique({
    where: {
      id: businessId,
    },
  });

  if (!business) {
    throw new NotFoundException('Business not found');
  }

  return this.prisma.business.update({
    where: {
      id: businessId,
    },
    data: {
      ...data,
    },
  });
}

  async deactivate(id: string, businessId: string) {
  if (id !== businessId) {
    throw new NotFoundException('Business not found');
  }

  const business = await this.prisma.business.findUnique({
    where: {
      id: businessId,
    },
  });

  if (!business) {
    throw new NotFoundException('Business not found');
  }

  return this.prisma.business.update({
    where: {
      id: businessId,
    },
    data: {
      isActive: false,
    },
  });
} 
  async remove(id: string, businessId: string) {
  if (id !== businessId) {
    throw new NotFoundException('Business not found');
  }

  const business = await this.prisma.business.findUnique({
    where: {
      id: businessId,
    },
  });

  if (!business) {
    throw new NotFoundException('Business not found');
  }

  return this.prisma.business.delete({
    where: {
      id: businessId,
    },
  });
}


}
