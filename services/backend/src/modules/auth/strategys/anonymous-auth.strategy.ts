import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-anonymous';
import { AuthStrategyEnum } from '../../../utils/auth.enum';

@Injectable()
export class AnonymousGuardStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyEnum.anonymousOAuth
) {
  constructor() {
    super();
  }

  public validate = (payload: unknown, request: unknown): unknown => request;
}
