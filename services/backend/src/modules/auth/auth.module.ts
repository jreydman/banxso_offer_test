import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { StrategyModule } from './strategys/strategy.module';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    StrategyModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, WsJwtGuard],
  exports: [AuthService, WsJwtGuard],
})
export class AuthModule {}
