import { Body, Controller, Post, HttpCode, HttpStatus, Res, Get } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from '../DTO/dto.register';
import { DbMain } from 'src/database/db.main';
import { Response } from 'express';
import { PwdEncrypt } from "../DTO/dto.password";
import { Cripto } from "../DTO/dto.cripto";

@Controller("/register")
export class UserCreate {

  @Get()
  @HttpCode(HttpStatus.BAD_REQUEST)
  async getUser(): Promise<object> {
    return { 
        status: 400,
        response: [
           "Você não está autorizado.",
           "Essa Rota não possui GET como método."
        ]
    }
  }
  
  @Post()
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() body: RegisterDto, @Res() res: Response) {
    // Validação de dados
    const user = plainToInstance(RegisterDto, body);
    const errors = await this.validate(user);
    
    if (errors.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Dados inválidos',
        errors,
      });
    }
  
    const { name, email, pass } = body;

    const db = new DbMain();
    
    try {
      if (name && email && pass) {
        const cripto_pass = new PwdEncrypt(pass).crypt();
        const create = await db.pushDb(name, email, await cripto_pass);
        
        if (create) {
          return res.status(HttpStatus.CREATED).json({
            status: "success",
            message: "Usuário criado com sucesso!",
            _hash: new Cripto(`${email}:${pass}`).crypt()
          });
        } else {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Erro ao criar usuário',
          });
        }
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: 'Dados ausentes (nome, email, ou senha)',
        });
      }
    } catch (error) {
      console.error('Erro no processo de criação de usuário:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Erro interno',
        error: error.message,
      });
    }
  }

  private async validate(dto: RegisterDto): Promise<string[]> {
    const errors = await validate(dto);
    const errorMessages = errors.map(err => {
      if (err.constraints) {
        return `${err.property}: ${Object.values(err.constraints).join(', ')}`;
      } else {
        return `${err.property}: erro desconhecido`;
      }
    });
    return errorMessages;
  }
}
