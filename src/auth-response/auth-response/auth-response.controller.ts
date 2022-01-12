import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  '325866638337-3fljd08asoqoj32lf7ebuqrrld8e8pu4.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/authResponse',
);

@Controller()
export class AuthResponseController {
  @Get()
  async authResponse(@Req() request: any, @Res() response: any): Promise<any> {
    try {
      oauth2Client.on('tokens', (tokens) => {
        console.log(tokens);
      });

      const response = request.query;
      const code = response.code;
      const tokens = (await oauth2Client.getToken(code)) as any;
      oauth2Client.setCredentials(tokens);
      console.log('Authentication Successful');
      response.set('Content-Type', 'application/json');
      response.send({
        status: 'AUTH_SUCCESS',
        message: 'OAuth Authentication Successful.',
      });
    } catch (e) {
      console.log(e);
      console.log('Auth Failed!');
      response.send('Authentication Failed');
    }
  }
  @Post()
  async sendMail(
    @Body('toName') toName: string,
    @Body('toAddress') toAddress: string,
    @Body('subject') subject: string,
    @Body('body') body: string,
  ) {
    console.log(toAddress, subject, Body);
    oauth2Client.setCredentials({
      refresh_token:
        '1//0gf0-RDjf7lbOCgYIARAAGBASNwF-L9IrM4DgMIukUGB8dVmzMyjIIuC7L01ZxOeGUi9Lry6TIS_HsnNGaYgM607WgbJU2XRQ-L4',
      access_token:
        'ya29.A0ARrdaM-F2fMPNedwamJdGT3LLlo5KJyO3sduEJ4o2kSUXlTF8jHaqUXFJwLBtw6lJTZThRPK-ATk-d8UTUa-k558OOAivUMM6dRaEgZShdeC3girYYhHOtN45x7mOoIBy1gxtO84lc0XhvsgW6Yi2DwxyIDD',
    });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const userProfile = (
      await gmail.users.getProfile({
        userId: 'me',
      })
    ).data;

    let userDisplayName = '';

    try {
      let oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });
      let info = (await oauth2.userinfo.get()).data;
      userDisplayName = info.name;
      const userProfile = (
        await gmail.users.getProfile({
          userId: 'me',
        })
      ).data;
      const mailType = 'text/html';

      const messageParts = [
        `From: ${userDisplayName} <${userProfile.emailAddress}>`,
        `To: ${toName} <${toAddress}>`,
        `Content-Type: ${mailType}; charset=utf-8`,
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        `${body}`,
      ];
      console.log(messageParts);
      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      console.log(encodedMessage);
      console.log('Mail Send Result:', result.data);
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }
}
