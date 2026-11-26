import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type {
  ApiErrorCode,
  ApiErrorDetail,
  ApiErrorResponse,
} from '@eventops/contracts';
import { ZodValidationException } from 'nestjs-zod';

interface RequestLike {
  id?: unknown;
}

interface ReplyLike {
  status(code: number): { send(payload: unknown): unknown };
}

interface ZodIssueLike {
  path: Array<string | number>;
  message: string;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<RequestLike>();
    const reply = ctx.getResponse<ReplyLike>();

    const requestId =
      typeof request.id === 'string' && request.id.length > 0
        ? request.id
        : 'req_unknown';
    const timestamp = new Date().toISOString();

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as { issues?: ZodIssueLike[] };
      const details: ApiErrorDetail[] = (zodError.issues ?? []).map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join('.') : 'body',
        issue: issue.message,
      }));

      const payload: ApiErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Data yang dikirim tidak valid.',
          details,
        },
        meta: { requestId, timestamp },
      };

      void reply.status(HttpStatus.BAD_REQUEST).send(payload);
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const responseObj =
        typeof response === 'object' && response !== null
          ? (response as Record<string, unknown>)
          : {};

      const code = this.mapStatusToErrorCode(
        status,
        typeof responseObj['code'] === 'string' ? responseObj['code'] : undefined,
      );
      const message =
        typeof responseObj['message'] === 'string'
          ? responseObj['message']
          : exception.message || 'Permintaan gagal diproses.';

      const payload: ApiErrorResponse = {
        success: false,
        error: {
          code,
          message,
          ...(Array.isArray(responseObj['details'])
            ? { details: responseObj['details'] as ApiErrorDetail[] }
            : {}),
        },
        meta: { requestId, timestamp },
      };

      void reply.status(status).send(payload);
      return;
    }

    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception.stack : String(exception),
    );

    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan internal pada server.',
      },
      meta: { requestId, timestamp },
    };

    void reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send(payload);
  }

  private mapStatusToErrorCode(
    status: number,
    explicitCode?: string,
  ): ApiErrorCode {
    if (explicitCode) {
      return explicitCode as ApiErrorCode;
    }
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'VALIDATION_ERROR';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED_SESSION';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN_INSUFFICIENT_ROLE';
      case HttpStatus.NOT_FOUND:
        return 'RESOURCE_NOT_FOUND';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
