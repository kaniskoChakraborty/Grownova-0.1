import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { Prisma } from '../../generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';

export interface CreateAuditLogInput {
  businessId: string;
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateAuditLogInput) {
    const previousLog = await this.prisma.auditLog.findFirst({
      where: {
        businessId: input.businessId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        hash: true,
      },
    });

    const previousHash = previousLog?.hash ?? null;
    const createdAt = new Date();

    const hashPayload = JSON.stringify({
      businessId: input.businessId,
      actorId: input.actorId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      previousHash,
      createdAt: createdAt.toISOString(),
    });

    const hash = createHash('sha256')
      .update(hashPayload)
      .digest('hex');

    return this.prisma.auditLog.create({
      data: {
        businessId: input.businessId,
        actorId: input.actorId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        metadata: input.metadata,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        previousHash,
        hash,
        createdAt,
      },
    });
  }

  async verifyIntegrity(businessId: string) {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        businessId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    let previousHash: string | null = null;

    for (const log of logs) {
      if (log.previousHash !== previousHash) {
        return {
          valid: false,
          checked: logs.length,
          brokenAt: log.id,
          reason: 'Previous hash mismatch',
        };
      }

      const hashPayload = JSON.stringify({
        businessId: log.businessId,
        actorId: log.actorId ?? null,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId ?? null,
        metadata: log.metadata ?? null,
        ipAddress: log.ipAddress ?? null,
        userAgent: log.userAgent ?? null,
        previousHash: log.previousHash,
        createdAt: log.createdAt.toISOString(),
      });

      const expectedHash = createHash('sha256')
        .update(hashPayload)
        .digest('hex');

      if (log.hash !== expectedHash) {
        return {
          valid: false,
          checked: logs.length,
          brokenAt: log.id,
          reason: 'Hash mismatch',
        };
      }

      previousHash = log.hash;
    }

    return {
      valid: true,
      checked: logs.length,
      brokenAt: null,
      reason: null,
    };
  }
}
