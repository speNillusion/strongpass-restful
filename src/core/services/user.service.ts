import { Injectable } from '@nestjs/common';
import { IUser, IUserResponse, ILoginResponse } from '../interfaces/user.interface';
import { DbMain } from '../../database/db.main';
import { PwdEncrypt } from '../../users/DTO/dto.password';
import { Cripto } from '../../users/DTO/dto.cripto';
import { TokenService } from './token.service';
import { InvalidCredentialsException, DatabaseOperationException } from '../exceptions/auth.exceptions';

@Injectable()
export class UserService {
  constructor(
    private readonly dbMain: DbMain,
    private readonly tokenService: TokenService
  ) {}

  async createUser(userData: IUser): Promise<IUserResponse> {
    try {
      if (!userData.email || !userData.pass || !userData.name) {
        throw new Error('Missing required user data');
      }

      const encryptedPass = await PwdEncrypt.encryptPassword(userData.pass);
      const encryptedEmail = Cripto.encryptEmail(userData.email);
      const tokenSecretKey = new Cripto(`${userData.email}:${userData.pass}`).crypt();

      await this.dbMain.pushDb(userData.name, encryptedEmail, encryptedPass, tokenSecretKey);

      return {
        statusCode: 201,
        message: 'User created successfully',
        acessToken: tokenSecretKey
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new DatabaseOperationException('Failed to create user');
    }
  }

  async loginUser(email: string, password: string): Promise<ILoginResponse> {
    try {
      if (!email || !password) {
        throw new InvalidCredentialsException();
      }

      const encryptedEmail = await Cripto.encryptEmail(email);
      const encryptedPass = await PwdEncrypt.encryptPassword(password);
      
      const isValid = await this.dbMain.get('SELECT id FROM users WHERE email = ? AND pass = ?', [encryptedEmail, encryptedPass]);
      if (!isValid.length) {
        throw new InvalidCredentialsException();
      }

      const [tokenSecretKey, clientId] = await Promise.all([
        this.dbMain.getKey(encryptedEmail),
        this.dbMain.getId(encryptedEmail)
      ]);

      if (!tokenSecretKey || !clientId) {
        throw new DatabaseOperationException('User credentials not found');
      }

      const { accessToken, refreshToken } = await this.tokenService.generateTokenPair(clientId, tokenSecretKey);

      if (!accessToken || !refreshToken) {
        throw new DatabaseOperationException('Failed to generate tokens');
      }

      return {
        statusCode: 200,
        message: 'Login successful',
        refreshToken,
        valid: true
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof InvalidCredentialsException) {
        throw error;
      }
      throw new DatabaseOperationException('Authentication service unavailable');
    }
  }
}
