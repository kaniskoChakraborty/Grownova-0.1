import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  await app.listen(port);
  logger.log(`GrowNova Backend running in [${nodeEnv}] mode on port ${port}`);
}

bootstrap();
