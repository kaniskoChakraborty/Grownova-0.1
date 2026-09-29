import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting GrowNova database seed...');

  const passwordHash = await bcrypt.hash('TestPassword123', 12);

  const business = await prisma.business.upsert({
    where: {
      id: '550e8400-e29b-41d4-a716-446655440000',
    },
    update: {
      name: 'GrowNova Demo',
      industry: 'Retail',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      isActive: true,
    },
    create: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'GrowNova Demo',
      industry: 'Retail',
      phone: '+91-9999999999',
      email: 'demo@grownova.in',
      address: 'New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },
  });

  const users = [
    {
      email: 'taksh.demo@grownova.in',
      name: 'Taksh Demo',
      role: 'OWNER' as const,
    },
    {
      email: 'accountant@grownova.local',
      name: 'GrowNova Accountant',
      role: 'ACCOUNTANT' as const,
    },
    {
      email: 'ops@grownova.local',
      name: 'GrowNova Operations',
      role: 'OPS' as const,
    },
    {
      email: 'test@grownova.local',
      name: 'GrowNova Employee',
      role: 'EMPLOYEE' as const,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role,
        businessId: business.id,
        passwordHash,
        isActive: true,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: business.id,
        passwordHash,
        isActive: true,
      },
    });
  }

  const modules = [
    {
      key: 'CRM',
      name: 'Customer Relationship Management',
    },
    {
      key: 'INVENTORY',
      name: 'Inventory Management',
    },
    {
      key: 'POS',
      name: 'Point of Sale',
    },
    {
      key: 'ACCOUNTING',
      name: 'Accounting',
    },
    {
      key: 'GST',
      name: 'GST & Tax',
    },
    {
      key: 'HR',
      name: 'Human Resources',
    },
  ];

  for (const module of modules) {
    await prisma.module.upsert({
      where: {
        businessId_key: {
          businessId: business.id,
          key: module.key,
        },
      },
      update: {
        name: module.name,
        enabled: true,
      },
      create: {
        businessId: business.id,
        key: module.key,
        name: module.name,
        enabled: true,
      },
    });
  }

  console.log('✅ Business seeded:', business.name);
  console.log('✅ Users seeded:', users.length);
  console.log('✅ Modules seeded:', modules.length);
  console.log('🌱 GrowNova seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
