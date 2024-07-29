import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthStrategyEnum } from '../../../utils/auth.enum';

@Injectable()
export class GoogleGuardStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyEnum.googleOAuth
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(_accessToken, _refreshToken, profile, callback) {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    callback(null, user);
  }
}
