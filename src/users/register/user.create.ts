import { Body, Controller, Post, HttpCode, HttpStatus, Get, Injectable } from "@nestjs/common";
import { RegisterDto } from '../DTO/dto.register';
import { UserService } from '../../core/services/user.service';
import { IUserResponse } from '../../core/interfaces/user.interface';

@Injectable()
@Controller("/register")
export class UserCreate {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  async getUser(): Promise<IUserResponse> {
    return {
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      message: 'GET method is not supported for this endpoint'
    };
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: RegisterDto): Promise<IUserResponse> {
    const { name, email, pass } = body;
    return await this.userService.createUser({ name, email, pass });
  }
}
