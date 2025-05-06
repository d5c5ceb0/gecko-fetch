import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    res.status(status).json({
      code: status,
      message: typeof message === 'string' ? message : (message as any).message,
      error: typeof message === 'string' ? message : (message as any).error || (message as any).message,
      //path: req.url,
      //timestamp: new Date().toISOString(),
      data: null,
    });
  }
}
