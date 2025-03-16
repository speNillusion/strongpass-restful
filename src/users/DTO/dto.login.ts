import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { EmailUnico } from './dto.email';

export class LoginDto {
    @IsEmail(undefined, { message: "Email invalido" })
    @EmailUnico({ message: "O email já existe "})
    @IsNotEmpty({ message: "Corpo Vazio"} )
    email: string;
  
    @IsString({ message: "Senha invalida" })
    @MinLength(6, { message: "Senha precisa ter pelo menos 6 characters" })
    @IsNotEmpty({ message: "Corpo Vazio"} )
    pass: string;
}
