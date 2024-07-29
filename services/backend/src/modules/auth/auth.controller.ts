import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthProviderEnum, AuthStrategyEnum } from '../../utils/auth.enum';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin/provider/google')
  @UseGuards(AuthGuard(AuthStrategyEnum.googleOAuth))
  async signinGoogle(@Req() { user }) {
    return this.authService.signinOAuth({
      email: user.email,
      signProviders: [AuthProviderEnum.GOOGLE],
    });
  }

  @Post('signin/provider/email')
  @HttpCode(HttpStatus.OK)
  async signinEmail(@Body() { email, password }, @Res() res: Response) {
    const tokens = await this.authService.signinAuth({
      email,
      password,
    });
    res.cookie('access_token', tokens.accessToken);
    res.cookie('refresh_token', tokens.refreshToken);
    res.json(tokens);
    return res.send();
  }

  @Post('signup/provider/email')
  async signupEmail(@Body() user) {
    return this.authService.signup(user);
  }

  @Get('verify/provider/email')
  async verifyEmail(@Query('verifyEmailToken') verifyEmailToken) {
    return this.authService.verifyEmailToken(verifyEmailToken);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard(AuthStrategyEnum.jwtAuth))
  async resetPassword(@Req() { user }, @Body() { password, resetPassword }) {
    if (
      !(await this.authService.verifyPassword({
        email: user.email,
        password,
      }))
    )
      throw new BadRequestException('Invalid password');
    return this.authService.update({
      email: user.email,
      password: resetPassword,
    });
  }

  @Get('refresh')
  @UseGuards(AuthGuard(AuthStrategyEnum.jwtAuth))
  async refresh(@Req() req, @Res() res) {
    const tokens = await this.authService.signTokens(req.user);
    res.cookie('refresh_token', tokens.refreshToken);
    res.cookie('access_token', tokens.accessToken);
    res.json(tokens);
    return res.send();
  }

  @Get('me')
  @UseGuards(AuthGuard(AuthStrategyEnum.jwtAuth))
  async me(@Req() { user }) {
    return user;
  }
}
