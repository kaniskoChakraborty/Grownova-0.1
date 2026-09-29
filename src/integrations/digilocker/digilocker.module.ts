import { Module } from '@nestjs/common';

import { DigilockerController } from './digilocker.controller';
import { DigilockerAdapter, MockDigilockerAdapter } from './digilocker.adapter';

@Module({
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
