import { Module } from '@nestjs/common';
import { AnonymousGuardStrategy } from './anonymous-auth.strategy';
import { GoogleGuardStrategy } from './google-oauth.strategy';
import { JwtGuardStrategy } from './jwt-auth.strategy';
import { JwtRefreshGuardStrategy } from './jwt-refresh-auth.strategy copy';

@Module({
  providers: [
    JwtGuardStrategy,
    JwtRefreshGuardStrategy,
    GoogleGuardStrategy,
    AnonymousGuardStrategy,
  ],
  exports: [
    JwtGuardStrategy,
    JwtRefreshGuardStrategy,
    GoogleGuardStrategy,
    AnonymousGuardStrategy,
  ],
})
export class StrategyModule {}
