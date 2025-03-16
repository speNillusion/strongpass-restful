import { Controller, Injectable, Headers, Get, HttpCode, HttpStatus, Post} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Cripto } from 'src/users/DTO/dto.cripto';
import { PwdEncrypt } from 'src/users/DTO/dto.password';
import { UserLogin } from 'src/users/login/user.login';

@Injectable()
@Controller("/generate")
export class PwdGenPass {

    @Get()
    @HttpCode(HttpStatus.OK)
    private async connectGen(@Headers('authorization') authHeader: string) {
        const userLogin = new UserLogin();
        const verify = await userLogin.GetResponse(authHeader); // anonymous call func
        const AleatoryClassification = randomUUID() // random ID
        const PassLong = new Cripto(AleatoryClassification).crypt() // criptografia base64
        const LongPass = new PwdEncrypt(PassLong).crypt() //criptografia com sha256


        const response = {
            statusCode: HttpStatus.OK,
            passwordGenerated: LongPass
        }

        return response;
    }
}
