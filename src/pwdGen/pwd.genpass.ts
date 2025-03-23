import { Controller, Injectable, Headers, Get, HttpCode, HttpStatus, Post, Query, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { DbMain } from 'src/database/db.main';
import { Cripto } from 'src/users/DTO/dto.cripto';
import { UserToken } from 'src/users/login/token/user.token';

@Injectable()
@Controller('/generate')
export class PasswordGeneratorService {
    private static readonly MAX_PASSWORD_LENGTH = 1000000;
    private static readonly DEFAULT_PASSWORD_LENGTH = 64;
    private static readonly ALLOWED_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

    constructor(
        private readonly dbMain: DbMain,
        private readonly userToken: UserToken
    ) {}

    @Get()
    @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
    private async handleGetRequest(): Promise<object> {
        return {
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            response: [
                'Method not allowed',
                'GET method is not supported for this route'
            ]
        };
    }

    private async generatePassword(length: number = PasswordGeneratorService.DEFAULT_PASSWORD_LENGTH): Promise<string> {
        const characters = PasswordGeneratorService.ALLOWED_CHARACTERS;
        const password = Array.from(
            { length }, 
            () => characters.charAt(Math.floor(Math.random() * characters.length))
        ).join('');
        
        return password;
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    private async generateSecurePassword(
        @Res() res: Response,
        @Headers('authorization') authHeader: string,
        @Body('email') email: string,
        @Query('quant') length?: number
    ): Promise<Response> {
        try {
            await this.validateRequest(authHeader, email, length);
            
            const password = await this.generatePassword(length || PasswordGeneratorService.DEFAULT_PASSWORD_LENGTH);
            
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                passwordGenerated: password
            });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    private async validateRequest(authHeader: string, email: string, length?: number): Promise<void> {
        if (length && length > PasswordGeneratorService.MAX_PASSWORD_LENGTH) {
            throw {
                status: HttpStatus.BAD_REQUEST,
                message: `Maximum password length is ${PasswordGeneratorService.MAX_PASSWORD_LENGTH}`
            };
        }

        const token = this.extractToken(authHeader);
        const encryptedEmail = Cripto.encryptEmail(email);
        const tokenSecretKey = await this.dbMain.getKey(encryptedEmail);
        
        const isValid = await this.userToken.verifyToken(token, tokenSecretKey);

        if (!isValid) {
            throw {
                status: HttpStatus.UNAUTHORIZED,
                message: 'Invalid authentication token'
            };
        }
    }

    private extractToken(authHeader: string): string {
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw {
                status: HttpStatus.UNAUTHORIZED,
                message: 'Invalid authorization header format'
            };
        }
        return token;
    }

    private handleError(res: Response, error: any): Response {
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Internal server error';

        return res.status(status).json({
            statusCode: status,
            response: message
        });
    }
}
