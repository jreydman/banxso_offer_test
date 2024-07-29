import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthStrategyEnum } from '../../../utils/auth.enum';

@Injectable()
export class JwtRefreshGuardStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyEnum.jwtRefresh
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  validate = (payload: unknown): unknown => payload;
}
