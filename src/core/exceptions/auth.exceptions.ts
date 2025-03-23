import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor(message: string = 'Invalid credentials') {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
      errors: [message]
    }, HttpStatus.UNAUTHORIZED);
  }
}

export class DatabaseOperationException extends HttpException {
  constructor(message: string = 'Database operation failed') {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      errors: [message]
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class TokenGenerationException extends HttpException {
  constructor(message: string = 'Failed to generate token') {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      errors: [message]
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}