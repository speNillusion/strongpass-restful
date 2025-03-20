import { Module } from '@nestjs/common';
import { UserCreate } from './register/user.create';
import { UserLogin } from './login/user.login';
import { UserGet } from './user.get';

@Module({
  controllers: [UserCreate,UserLogin,/*UserGet - Em manutenção*/],
  providers: []
})

export class UserModule {}
