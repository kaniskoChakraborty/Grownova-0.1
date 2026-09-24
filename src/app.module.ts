import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessesModule } from './businesses/businesses.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { CrmModule } from './crm/crm.module';
import { InventoryModule } from './inventory/inventory.module';
import { PosModule } from './pos/pos.module';
import { AccountingModule } from './accounting/accounting.module';
import { GstModule } from './gst/gst.module';
import { HrModule } from './hr/hr.module';
import { PayrollModule } from './payroll/payroll.module';
import { ProductionModule } from './production/production.module';
import { MarketingModule } from './marketing/marketing.module';
import { SupportModule } from './support/support.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { GrowaiModule } from './growai/growai.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JobsModule } from './jobs/jobs.module';
import { DigilockerModule } from './integerations/digilocker/digilocker.module';
import { WhatsappModule } from './integerations/whatsapp/whatsapp.module';
import { GstnModule } from './integerations/gstn/gstn.module';
import { UpiModule } from './integerations/upi/upi.module';
import { OndcModule } from './integerations/ondc/ondc.module';
import { TallyModule } from './integerations/tally/tally.module';
import { TranslationModule } from './integerations/translation/translation.module';
import configuration from './config/configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
  envFilePath: '.env',
}),		
    HealthModule,
    RedisModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    BusinessesModule,
    OnboardingModule,
    CrmModule,
    InventoryModule,
    PosModule,
    AccountingModule,
    GstModule,
    HrModule,
    PayrollModule,
    ProductionModule,
    MarketingModule,
    SupportModule,
    DashboardModule,
    CollaborationModule,
    GrowaiModule,
    AuditModule,
    NotificationsModule,
    JobsModule,
    DigilockerModule,
    WhatsappModule,
    GstnModule,
    UpiModule,
    OndcModule,
    TallyModule,
    TranslationModule,
  ],
})
export class AppModule {}
