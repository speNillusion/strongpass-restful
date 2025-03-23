import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { IUserResponse } from '../interfaces/user.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const errorResponse: IUserResponse = {
      statusCode: status,
      message: typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message,
      errors: Array.isArray(exceptionResponse.message) ? exceptionResponse.message : [exceptionResponse.message]
    };

    if (status === HttpStatus.UNAUTHORIZED) {
      errorResponse.message = 'Authentication failed';
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.message = 'Internal server error';
      // Log the actual error for debugging
      console.error('Internal Server Error:', exception);
    }

    response.status(status).json(errorResponse);
  }
}