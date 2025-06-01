import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message;

    const stack =
      exception instanceof HttpException ? null : (exception as Error).stack;

    // 콘솔 로그로 찍기
    console.error({
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message,
      stack,
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
    });
  }
}
