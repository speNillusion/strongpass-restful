import { Controller, Injectable, Get, HttpCode, HttpStatus, Post, Headers, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserLogin } from './login/user.login';
import { DbMain } from 'src/database/db.main';

@Injectable()
@Controller("/admin")
export class UserGet {

    @Get()
    @HttpCode(HttpStatus.OK)
    private async userGet(@Headers('authorization') authHeader: string, @Res() res: Response): Promise<any> {
        const userLogin = new UserLogin();
        const main = new DbMain();
        const verify = await userLogin.GetResponse(authHeader);
        const rowUsers = await main.getDb();
    
        if (verify) {
            if (rowUsers) {
                return res.status(HttpStatus.OK).json({
                    users: [...rowUsers]
                });
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    response: [
                        "Você não está autorizado.",
                        "O token fornecido é inválido."
                    ]
                });
            }
        } else {
            return res.status(HttpStatus.FORBIDDEN).json({
                response: [
                    "Falha na verificação do token."
                ]
            });
        }
    }    

    @Post()
    @HttpCode(HttpStatus.BAD_REQUEST)
    private async notUsePost(@Res() res: Response): Promise<object> {
        return res.status(HttpStatus.BAD_REQUEST).json({
            status: 400,
            response: [
                "Você não está autorizado.",
                "Essa rota não possui POST como método."
            ]
        });
    }
}
