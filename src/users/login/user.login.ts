import { Controller, Injectable, Headers, UnauthorizedException, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Cripto } from '../DTO/dto.cripto';
import { PwdEncrypt } from '../DTO/dto.password';
import { dbConnection } from 'src/database/db.connect';
import { DbMain } from 'src/database/db.main';
import { UserToken } from './token/user.token';

// Define types for better type safety
interface UserResponse {
    statusCode: number;  // Changed from Number to number
    message: string;
    accessToken: string; // Fixed typo in property name
    valid: boolean;
}

interface User {
    email: string;
    pass: string;
}

@Injectable()
@Controller('/login')
export class UserLogin {
    private readonly dbMain: DbMain;
    private readonly userToken: UserToken;

    constructor() {
        this.dbMain = new DbMain();
        this.userToken = new UserToken();
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    private async login(@Headers('authorization') authHeader: string): Promise<UserResponse> {
        const token = this.validateAuthHeader(authHeader);
        const { email, password } = await this.extractCredentials(token);
        const user = await this.validateUser(email, password);
        
        const [tokenSecretKey, clientId] = await Promise.all([
            this.dbMain.getKey(email),
            this.dbMain.getId(email)
        ]);

        const accessToken = await this.userToken.generateToken(clientId, tokenSecretKey);

        return {
            statusCode: HttpStatus.OK,
            message: 'Login successful',
            accessToken,
            valid: true
        };
    }

    private validateAuthHeader(authHeader: string): string {
        if (!authHeader) {
            throw new UnauthorizedException('Token not provided');
        }

        const [, token] = authHeader.split(' ');
        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }

        return token;
    }

    private async extractCredentials(token: string): Promise<{ email: string; password: string }> {
        const decoded = new Cripto(token).decrypt();
        const [email, password] = decoded.split(':');

        if (!email || !password) {
            throw new UnauthorizedException('Invalid login credentials');
        }

        return { email, password };
    }

    private async validateUser(email: string, password: string): Promise<User> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Email not found');
        }

        const encryptedPassword = await new PwdEncrypt(password).crypt();
        const isPasswordValid = await this.comparePasswords(encryptedPassword, user.pass);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    public async verifyAuth(auth: string): Promise<boolean> {
        try {
            const response = await this.login(auth);
            return response.valid;
        } catch {
            return false;
        }
    }

    @Post()
    @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
    private async notUsePost(): Promise<object> {
        return {
            status: HttpStatus.METHOD_NOT_ALLOWED,
            response: [
                'Unauthorized access',
                'POST method is not allowed for this route'
            ]
        };
    }

    private async findUserByEmail(email: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            dbConnection.query(
                'SELECT email, pass FROM users WHERE email = ?',
                [email],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results[0] || null);
                    }
                }
            );
        });
    }

    private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return plainPassword === hashedPassword;
    }
}
