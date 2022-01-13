import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { google } from 'googleapis';
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CALLBACK_URL,
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
