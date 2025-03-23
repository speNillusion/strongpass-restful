import { Module } from '@nestjs/common';
import { UserCreate } from './register/user.create';
import { UserLogin } from './login/user.login';
import { UserGet } from './user.get';
import { DbMain } from 'src/database/db.main';

@Module({
  controllers: [UserCreate,UserLogin,UserGet],
  providers: [DbMain],
  exports: [DbMain]
})

export class UserModule {}
