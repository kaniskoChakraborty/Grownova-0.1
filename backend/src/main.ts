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

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv =
    configService.get<string>('NODE_ENV') || 'development';

  // Environment-aware CORS configuration
  const configuredOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    configService.get<string>('FRONTEND_URL'),
    configService.get<string>('CORS_ORIGIN'),
  ].filter((origin): origin is string => Boolean(origin));

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        configuredOrigins.includes(origin) ||
        (nodeEnv === 'development' &&
          /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
      ) {
        return callback(null, true);
      }
      return callback(
        new Error(`CORS blocked request from origin: ${origin}`),
        false,
      );
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

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
