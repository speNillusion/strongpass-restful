import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RateLimitException } from '../exceptions/rate-limit.exception';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requestMap = new Map<string, { count: number; firstRequest: number }>();
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests = 5; // Max 5 failed attempts

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip;

    const now = Date.now();
    const clientData = this.requestMap.get(clientIp) || { count: 0, firstRequest: now };

    // Reset if window has expired
    if (now - clientData.firstRequest > this.windowMs) {
      clientData.count = 1;
      clientData.firstRequest = now;
    } else {
      clientData.count++;
    }

    this.requestMap.set(clientIp, clientData);

    if (clientData.count > this.maxRequests) {
      const timeLeft = Math.ceil((this.windowMs - (now - clientData.firstRequest)) / 1000);
      throw new RateLimitException(`Too many login attempts. Please try again in ${timeLeft} seconds`);
    }

    return true;
  }
}