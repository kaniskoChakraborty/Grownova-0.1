import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.route?.path ?? request.path ?? '';

    // Only audit write operations.
    if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    // Never audit the audit endpoints themselves.
    if (path.startsWith('/audit')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (response) => {
        const user = request.user;

        // Only create audit entries for authenticated tenant requests.
        if (!user?.businessId) {
          return;
        }

        const action = `${method} ${path}`;

        let entityId: string | undefined;

        if (request.params?.id) {
          entityId = request.params.id;
        } else if (response?.id) {
          entityId = response.id;
        }

        await this.auditService.create({
          businessId: user.businessId,
          actorId: user.id,
          action,
          entity: path,
          entityId,
          metadata: {
            statusCode: context.switchToHttp().getResponse().statusCode,
          },
          ipAddress:
            request.ip ??
            request.headers['x-forwarded-for'] ??
            undefined,
          userAgent: request.headers['user-agent'] ?? undefined,
        });
      }),
    );
  }
}
