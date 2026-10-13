import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'http';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    let message: string | string[] = 'Internal server error';
    // Default label follows the status (401 -> "Unauthorized"), not a fixed 500 text.
    let error = STATUS_CODES[status] ?? 'Error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      exceptionResponse &&
      typeof exceptionResponse === 'object'
    ) {
      const body = exceptionResponse as {
        message?: string | string[];
        error?: string;
      };

      if (body.message) {
        message = body.message;
      }

      if (body.error) {
        error = body.error;
      }
    }

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        error,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

}
