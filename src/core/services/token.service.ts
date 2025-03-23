import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenGenerationException } from '../exceptions/auth.exceptions';

interface TokenPayload {
  userId: number;
  tokenType: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_EXPIRATION = '1h';
  private readonly REFRESH_TOKEN_EXPIRATION = '7d';

  async generateTokenPair(userId: number, secretKey: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken(userId, secretKey, 'access'),
        this.generateToken(userId, secretKey, 'refresh')
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Token generation error:', error);
      throw new TokenGenerationException('Failed to generate tokens');
    }
  }

  private async generateToken(userId: number, secretKey: string, tokenType: 'access' | 'refresh'): Promise<string> {
    const payload: TokenPayload = {
      userId,
      tokenType
    };

    const expiration = tokenType === 'access' ? this.ACCESS_TOKEN_EXPIRATION : this.REFRESH_TOKEN_EXPIRATION;

    return jwt.sign(payload, secretKey, { expiresIn: expiration });
  }

  async verifyToken(token: string, secretKey: string): Promise<TokenPayload | null> {
    try {
      return jwt.verify(token, secretKey) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.error('JWT verification failed:', error.message);
      } else {
        console.error('Unexpected error during token verification:', error);
      }
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string, secretKey: string): Promise<string | null> {
    const payload = await this.verifyToken(refreshToken, secretKey);
    
    if (!payload || payload.tokenType !== 'refresh') {
      return null;
    }

    return this.generateToken(payload.userId, secretKey, 'access');
  }
}