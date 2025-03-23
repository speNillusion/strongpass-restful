import * as jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: number;
    iat?: number;
    exp?: number;
}

interface IToken {
    generateToken(userId: number, secretKey: string): Promise<string>;
    verifyToken(token: string, secretKey: string): Promise<TokenPayload | null>;
}

export class UserToken implements IToken {
    private readonly TOKEN_EXPIRATION = '1h';

    public async verifyToken(token: string, secretKey: string): Promise<TokenPayload | null> {
        try {
            console.log('Verifying token:', token);
            const decoded = jwt.verify(token, secretKey) as TokenPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                // Handle specific JWT errors if needed
                console.error('JWT verification failed:', error.message);
            } else {
                console.error('Unexpected error during token verification:', error);
            }
            return null;
        }
    }

    public async generateToken(userId: number, secretKey: string): Promise<string> {
        try {
            const payload: TokenPayload = { userId };
            const token = jwt.sign(payload, secretKey, { 
                expiresIn: this.TOKEN_EXPIRATION,
                algorithm: 'HS256' // Explicitly specify the algorithm
            });
            
            return token;
        } catch (error) {
            console.error('Token generation failed:', error);
            throw new Error('Failed to generate token');
        }
    }
}
