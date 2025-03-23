import { Controller, Injectable, Headers, UnauthorizedException, Get, HttpCode, HttpStatus, UseFilters, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../../core/services/user.service';
import { ILoginResponse, IUserResponse } from '../../core/interfaces/user.interface';
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter';
import { RateLimitGuard } from '../../core/guards/rate-limit.guard';
import { InvalidCredentialsException, DatabaseOperationException } from '../../core/exceptions/auth.exceptions';

@Injectable()
@Controller('/login')
export class UserLogin {
    constructor(private readonly userService: UserService) {}

    private extractCredentials(authHeader: string): { email: string; password: string } {
        console.log(authHeader)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid authorization header');
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');

        if (!email || !password) {
            throw new UnauthorizedException('Invalid credentials format');
        }

        return { email, password };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseFilters(HttpExceptionFilter)
    @UseGuards(RateLimitGuard)
    async login(@Headers('authorization') authHeader: string): Promise<ILoginResponse> {
        const { email, password } = this.extractCredentials(authHeader);
        return await this.userService.loginUser(email, password);
    }

    @Post()
    @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
    async notUsePost(): Promise<IUserResponse> {
        return {
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            message: 'POST method is not allowed for this route'
        };
    }
}
