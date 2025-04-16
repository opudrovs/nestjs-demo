import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter that catches all unhandled exceptions and formats the response.
 * It logs the error details and sends a structured JSON response to the client.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'object' && responseBody !== null) {
        const responseObj = responseBody as Record<string, unknown>;
        message =
          typeof responseObj.message === 'string'
            ? responseObj.message
            : JSON.stringify(responseObj);
      } else {
        message = responseBody;
      }
    }

    this.logger.error(
      `[${request.method}] ${request.url} - ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
