import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Shared BullMQ connection (same Redis as RedisModule). Feature modules register their own queues.
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { host: config.get<string>('redis.host'), port: config.get<number>('redis.port') },
      }),
    }),
  ],
})
export class JobsModule {}
