import { Module, Global } from '@nestjs/common';
import { UserService } from './services/user.service';
import { DbMain } from '../database/db.main';
import { TokenService } from './services/token.service';

@Global()
@Module({
  providers: [UserService, DbMain, TokenService],
  exports: [UserService, TokenService]
})
export class CoreModule {}