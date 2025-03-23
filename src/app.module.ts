import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PwdGenModule } from './pwdGen/pwd.module';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CoreModule,
    UserModule,
    PwdGenModule
  ]
})
export class AppModule {}
