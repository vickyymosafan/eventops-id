import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { ApiSuccessResponse } from '@eventops/contracts';
import { Observable, map } from 'rxjs';

interface RequestLike {
  id?: unknown;
}

@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    const request = context.switchToHttp().getRequest<RequestLike>();
    const requestId =
      typeof request.id === 'string' && request.id.length > 0
        ? request.id
        : 'req_unknown';

    return next.handle().pipe(
      map((data) => {
        if (
          typeof data === 'object' &&
          data !== null &&
          'success' in data &&
          'meta' in data
        ) {
          return data as unknown as ApiSuccessResponse<T>;
        }

        return {
          success: true,
          data,
          meta: {
            requestId,
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
