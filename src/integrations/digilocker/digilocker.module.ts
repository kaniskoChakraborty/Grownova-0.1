import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';

import { DigilockerController } from './digilocker.controller';
import { DigilockerAdapter, MockDigilockerAdapter } from './digilocker.adapter';

@Module({
  imports: [PrismaModule],
  controllers: [DigilockerController],
  providers: [
    {
      provide: DigilockerAdapter,
      useClass: MockDigilockerAdapter,
    },
  ],
  exports: [DigilockerAdapter],
})
export class DigilockerModule {}
