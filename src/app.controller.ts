import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { google } from 'googleapis';
const oauth2Client = new google.auth.OAuth2(
  '325866638337-3fljd08asoqoj32lf7ebuqrrld8e8pu4.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/authResponse',
);

const token = {
  accessToken: '',
  refreshToken: '',
};

oauth2Client.on('tokens', (tokens) => {
  console.log(tokens);
});

const scopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/userinfo.profile',
];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    if (token.refreshToken || token.accessToken) return true;

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });
    return url;
  }
}
