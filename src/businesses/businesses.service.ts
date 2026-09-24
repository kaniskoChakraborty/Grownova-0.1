import { Injectable } from '@nestjs/common';
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

  async findById(id: string) {
    return this.prisma.business.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.business.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
