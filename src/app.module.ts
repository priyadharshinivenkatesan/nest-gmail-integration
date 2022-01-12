import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthResponseModule } from './auth-response/auth-response.module';

@Module({
  imports: [
    AuthResponseModule,
    RouterModule.register([
      { path: 'authResponse', module: AuthResponseModule },
      { path: 'send', module: AuthResponseModule },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
