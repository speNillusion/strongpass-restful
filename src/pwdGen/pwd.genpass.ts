import { Controller, Injectable, Headers, Get, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { UserLogin } from 'src/users/login/user.login';
import { Response } from 'express';

@Injectable()
@Controller("/generate")
export class PwdGenPass {

    @Get()
    @HttpCode(HttpStatus.OK)
    private async connectGen(@Res() res: Response, @Headers('authorization') authHeader: string, @Query('quant') quant?: number) {
        const userLogin = new UserLogin();
        await userLogin.GetResponse(authHeader);

        if (quant && quant > 1000000) {
            const response = {
                statusCode: HttpStatus.BAD_REQUEST,
                response: "Max Length is 1,000,000"
            };
            return res.status(HttpStatus.BAD_REQUEST).json(response);
        };

        const strongPass = await this.gerarSenha(quant || 64);

        const response = {
            statusCode: HttpStatus.OK,
            passwordGenerated: strongPass
        };

        return res.status(HttpStatus.OK).json(response);
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
    @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
    private async notUsePost(): Promise<object> {
        return {
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            response: [
                "Você não está autorizado.",
                "Essa rota não possui POST como método."
            ]
        };
    }
}
