import { Controller, Injectable, Headers, Get, HttpCode, HttpStatus, Post, Query, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { DbMain } from 'src/database/db.main';
import { UserToken } from 'src/users/login/token/user.token';

@Injectable()
@Controller("/generate")
export class PwdGenPass {

    @Get()
    @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
    private async notUseGet(): Promise<object> {
        return {
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            response: [
                "Você não está autorizado.",
                "Essa rota não possui GET como método."
            ]
        };
    }

    private async gerarSenha(quant: number = 64): Promise<string> {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';
        let senha = '';
        for (let i = 0; i < quant; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            senha += caracteres[indice];
        }
        return Promise.resolve(senha);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    private async connectGen(@Res() res: Response, @Headers('authorization') authHeader: string, @Body('email') email: string, @Query('quant') quant?: number) {
        const userId = new UserToken();
        const dbMain = new DbMain();
        const tokenSecretKey: string = await dbMain.getKey(email);
        const isValid = await userId.verifyToken(authHeader.split(' ')[1], tokenSecretKey);

        if (quant && quant > 1000000) {
            const response = {
                statusCode: HttpStatus.BAD_GATEWAY,
                response: "Max Length is 1,000,000"
            };
            return res.status(HttpStatus.BAD_GATEWAY).json(response);
        };

        if (!isValid) {
            const response = {
                statusCode: HttpStatus.UNAUTHORIZED,
                response: "not valid"
            };
            return res.status(HttpStatus.UNAUTHORIZED).json(response);
        };

        const strongPass = await this.gerarSenha(quant || 64);

        const response = {
            statusCode: HttpStatus.OK,
            passwordGenerated: strongPass
        };

        return res.status(HttpStatus.OK).json(response);
    }
    
}
