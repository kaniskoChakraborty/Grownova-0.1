import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,

    PrismaModule,
    RedisModule,

    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
