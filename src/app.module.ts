import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PwdGenModule } from './pwdGen/pwd.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule,PwdGenModule, ConfigModule.forRoot({ isGlobal: true })]
})
export class AppModule {}
