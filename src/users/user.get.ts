import { Controller, Injectable, Get, HttpCode, HttpStatus, Post, Headers, Res, Body, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { DbMain } from 'src/database/db.main';
import { UserToken } from './login/token/user.token';

@Injectable()
@Controller("/admin")
export class UserGet {
    private readonly ADMIN_EMAIL = 'admin@admin.com';
    private readonly userToken: UserToken;
    private readonly dbMain: DbMain;

    constructor() {
        this.userToken = new UserToken();
        this.dbMain = new DbMain();
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    private async getUsers(
        @Res() res: Response,
        @Headers('authorization') authHeader: string,
        @Body('email') email: string
    ): Promise<Response> {
        try {
            await this.validateRequest(authHeader, email);
            const users = await this.dbMain.getDb();
            
            return res.status(HttpStatus.OK).json({ users });
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    response: error.message
                });
            }
            
            throw error;
        }
    }

    private async validateRequest(authHeader: string, email: string): Promise<void> {
        if (!authHeader) {
            throw new UnauthorizedException('Token não fornecido');
        }

        const token = authHeader.split(' ')[1];
        const tokenSecretKey = await this.dbMain.getKey(email);
        const isValid = await this.userToken.verifyToken(token, tokenSecretKey);

        if (!isValid) {
            throw new UnauthorizedException('Token inválido');
        }

        if (email !== this.ADMIN_EMAIL) {
            throw new UnauthorizedException('Você não está autorizado');
        }
    }

    @Get()
    @HttpCode(HttpStatus.BAD_REQUEST)
    private async notUseGet(@Res() res: Response): Promise<Response> {
        return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            response: [
                'Você não está autorizado',
                'Essa rota não possui GET como método'
            ]
        });
    }
}
