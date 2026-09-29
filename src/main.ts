import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv =
    configService.get<string>('NODE_ENV') || 'development';

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('GrowNova API')
    .setDescription(
      'GrowNova AI-first business operating system API for Indian MSMEs',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(port);

  logger.log(
    `GrowNova Backend running in [${nodeEnv}] mode on port ${port}`,
  );
  logger.log(`Swagger documentation available at /docs`);
}

bootstrap();
