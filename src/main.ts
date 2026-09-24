import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv =
    configService.get<string>('NODE_ENV') || 'development';

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
