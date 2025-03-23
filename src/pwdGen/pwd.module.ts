import { Module } from '@nestjs/common';
import { PasswordGeneratorService } from './pwd.genpass';
import { DbMain } from 'src/database/db.main';
import { UserToken } from 'src/users/login/token/user.token';

@Module({
  controllers: [PasswordGeneratorService],
  providers: [PasswordGeneratorService, DbMain, UserToken],
  exports: [DbMain,UserToken]
})

export class PwdGenModule {}
