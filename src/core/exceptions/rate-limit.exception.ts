import { HttpException, HttpStatus } from '@nestjs/common';

export class RateLimitException extends HttpException {
  constructor(message: string = 'Too many requests') {
    super({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message,
      errors: [message],
      retryAfter: 60 // Seconds until next attempt is allowed
    }, HttpStatus.TOO_MANY_REQUESTS);
  }
}