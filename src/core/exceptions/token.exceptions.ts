import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor(message: string = 'Token has expired') {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
      errors: [message]
    }, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidTokenException extends HttpException {
  constructor(message: string = 'Invalid token provided') {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
      errors: [message]
    }, HttpStatus.UNAUTHORIZED);
  }
}

export class TokenRefreshException extends HttpException {
  constructor(message: string = 'Failed to refresh token') {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
      errors: [message]
    }, HttpStatus.UNAUTHORIZED);
  }
}