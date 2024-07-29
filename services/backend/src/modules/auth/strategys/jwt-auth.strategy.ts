import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthStrategyEnum } from 'src/utils/auth.enum';

@Injectable()
export class JwtGuardStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyEnum.jwtAuth
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  validate = ({ user }) => user;
}
