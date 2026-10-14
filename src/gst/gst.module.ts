import { Module } from '@nestjs/common';
import { GstController } from './gst.controller';

@Module({ controllers: [GstController] })
export class GstModule {}
