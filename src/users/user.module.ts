import { Module } from '@nestjs/common';
import { UserCreate } from './register/user.create';
import { UserLogin } from './login/user.login';

@Module({
  controllers: [UserCreate,UserLogin],
  providers: []
})

export class UserModule {}
