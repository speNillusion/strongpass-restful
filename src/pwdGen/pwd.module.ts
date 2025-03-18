import { Module } from '@nestjs/common';
import { PwdGenPass } from './pwd.genpass';

@Module({
  controllers: [PwdGenPass],
  providers: [PwdGenPass]
})

export class PwdGenModule {}
