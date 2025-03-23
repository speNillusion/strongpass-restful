import { Body, Controller, Post, HttpCode, HttpStatus, Res, Get, Injectable } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from '../DTO/dto.register';
import { DbMain } from 'src/database/db.main';
import { Response } from 'express';
import { PwdEncrypt } from "../DTO/dto.password";
import { Cripto } from "../DTO/dto.cripto";

interface IUserResponse {
  status: string;
  message: string;
  _hash?: string;
  errors?: string[];
}

@Injectable()
@Controller("/register")
export class UserCreate {
  constructor(private readonly dbMain: DbMain) {}

  @Get()
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  async getUser(): Promise<IUserResponse> {
    return {
      status: 'error',
      message: 'GET method is not supported for this endpoint'
    };
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: RegisterDto, @Res() res: Response): Promise<Response> {
    try {
      const validationErrors = await this.validateUserData(body);
      if (validationErrors.length > 0) {
        return this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, 'Invalid data', validationErrors);
      }

      const { name, email, pass } = body;
      if (!this.areRequiredFieldsPresent(name, email, pass)) {
        return this.sendErrorResponse(
          res, 
          HttpStatus.BAD_REQUEST, 
          'Missing required fields (name, email, or password)'
        );
      }

      const encryptedData = await this.encryptUserData(email, pass);
      const userCreated = await this.dbMain.pushDb(
        name,
        email,
        encryptedData.password,
        encryptedData.hash
      );

      if (!userCreated) {
        return this.sendErrorResponse(
          res,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Failed to create user'
        );
      }

      return res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "User created successfully",
        _hash: encryptedData.originalHash
      });

    } catch (error) {
      console.error('Error in user creation process:', error);
      return this.sendErrorResponse(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        [error.message]
      );
    }
  }

  private async validateUserData(data: RegisterDto): Promise<string[]> {
    const user = plainToInstance(RegisterDto, data);
    const errors = await validate(user);
    return errors.map(err => 
      err.constraints
        ? `${err.property}: ${Object.values(err.constraints).join(', ')}`
        : `${err.property}: unknown error`
    );
  }

  private areRequiredFieldsPresent(name?: string, email?: string, pass?: string): boolean {
    return Boolean(name && email && pass);
  }

  private async encryptUserData(email: string, pass: string) {
    const originalHash = new Cripto(`${email}:${pass}`).crypt();
    const password = await new PwdEncrypt(pass).crypt();
    const hash = await new PwdEncrypt(originalHash).crypt();
    
    return { password, hash, originalHash };
  }

  private sendErrorResponse(
    res: Response,
    status: HttpStatus,
    message: string,
    errors: string[] = []
  ): Response {
    return res.status(status).json({
      status: 'error',
      message,
      ...(errors.length && { errors })
    });
  }
}
