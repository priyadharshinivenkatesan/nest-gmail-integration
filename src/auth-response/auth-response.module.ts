import { Module } from '@nestjs/common';
import { AuthResponseController } from './auth-response/auth-response.controller';

@Module({
  controllers: [AuthResponseController]
})
export class AuthResponseModule {}
