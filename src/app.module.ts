import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PwdGenModule } from './pwd/pwd.module';

@Module({
  imports: [UserModule,PwdGenModule]
})
export class AppModule {}
