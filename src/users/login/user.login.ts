import { Controller, Injectable, Headers, UnauthorizedException, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Cripto } from '../DTO/dto.cripto';
import { PwdEncrypt } from '../DTO/dto.password';
import { dbConnection } from 'src/database/db.connect';
import { DbMain } from 'src/database/db.main';
import { UserToken } from './token/user.token';

interface UserResponse {
    statusCode: Number,
    message: string,
    acessToken: string,
    valid: boolean

}

@Injectable()
@Controller("/login")
export class UserLogin {
    static GetResponse: any;

    @Get()
    @HttpCode(HttpStatus.OK)
    private async login(@Headers('authorization') authHeader: string): Promise<UserResponse> {
        if (!authHeader) {
            throw new UnauthorizedException('Token não fornecido');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token inválido');
        }

        const decoded = new Cripto(token).decrypt();
        const [email, pass] = decoded.split(':');

        if (!email || !pass) {
            throw new UnauthorizedException('Dados de login inválidos');
        }

        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Email não encontrado');
        }

        const criptoPass = new PwdEncrypt(pass).crypt();
        const isPasswordValid = await this.comparePasswords(await criptoPass, user.pass);

        const dbMain = new DbMain();

        const tokenSecretKey: string = await dbMain.getKey(email);
        const clientId: number = await dbMain.getId(email);

        const acessTk = await new UserToken().generateToken(clientId, tokenSecretKey);

        if (isPasswordValid) {
            return {
                statusCode: HttpStatus.OK, 
                message: 'Login bem-sucedido', 
                acessToken: acessTk,
                valid: true
            };
        } else {
            throw new UnauthorizedException('token invalido!');
        }
    }

    public async GetResponse(auth): Promise<boolean> {
        const verify = await this.login(auth);

        if (verify?.valid) {
            return true
        } else {
            return false
        }
    };

    @Post()
    @HttpCode(HttpStatus.BAD_REQUEST)
    private async notUsePost(): Promise<object> {
        return {
            status: 400,
            response: [
                "Você não está autorizado.",
                "Essa rota não possui POST como método."
            ]
        };
    }
    

    private async findUserByEmail(email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            dbConnection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0] || null);
                }
            });
        });
    }

    private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        if (plainPassword !== hashedPassword) {
            return false;
        }
        return true;
    }
}
