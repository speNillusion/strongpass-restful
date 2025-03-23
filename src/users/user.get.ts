import { Controller, Injectable, Get, HttpCode, HttpStatus, Post, Headers, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { UserLogin } from './login/user.login';
import { DbMain } from 'src/database/db.main';
import { UserToken } from './login/token/user.token';

@Injectable()
@Controller("/admin")
export class UserGet {

    @Post()
    @HttpCode(HttpStatus.OK)
    private async getUsers(@Res() res: Response, @Headers('authorization') authHeader: string, @Body('email') email: string): Promise<any> {
        const userId = new UserToken();
        const dbMain = new DbMain();
        const tokenSecretKey: string = await dbMain.getKey(email);
        const isValid = await userId.verifyToken(authHeader.split(' ')[1], tokenSecretKey);
        const rowUsers = await dbMain.getDb();
    
        if (isValid) {
            if (email != 'admin@admin.com') {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    response: "Você não está autorizado."
                });
            }
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
            return res.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                response: "Você não está autorizado."
            });
        }
    }    

    @Get()
    @HttpCode(HttpStatus.BAD_REQUEST)
    private async notUseGet(@Res() res: Response): Promise<object> {
        return res.status(HttpStatus.BAD_REQUEST).json({
            status: 400,
            response: [
                "Você não está autorizado.",
                "Essa rota não possui GET como método."
            ]
        });
    }
}
