import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthProviderEnum, AuthStatusEnum } from '../../utils/auth.enum';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly prismaService: PrismaService
  ) {}

  private jwtOptions = {
    access: {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
    },
  };

  async signinAuth({ email, password }) {
    try {
      const userExists = await this.prismaService.user.findFirstOrThrow({
        where: { email },
      });
      if (userExists.signStatus !== AuthStatusEnum.ACTIVE)
        throw new UnauthorizedException('User is not active');
      if (
        !(await this.verifyPassword({
          email,
          password,
        }))
      )
        throw new UnauthorizedException('Invalid password');
      return this.signTokens(userExists);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async signinOAuth(user) {
    let currentUser = await this.prismaService.user.upsert({
      where: { email: user.email },
      create: {
        ...user,
        signStatus: AuthStatusEnum.ACTIVE,
        password: null,
      },
      update: {},
    });

    user.signProviders.forEach((provider) => {
      if (!currentUser.signProviders.includes(provider)) {
        currentUser.signProviders.push(provider);
      }
    });

    const { accessToken, refreshToken } = await this.signTokens(currentUser);

    currentUser.refreshJwtToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: { email: currentUser.email },
      data: currentUser,
    });

    return { accessToken, refreshToken };
  }

  async update(user) {
    const currentUser = await this.prismaService.user.findFirstOrThrow({
      where: { email: user.email },
    });

    Object.assign(currentUser, user);

    if (user.password) {
      currentUser.password = await bcrypt.hash(user.password, 10);
      if (!currentUser.signProviders.includes(AuthProviderEnum.EMAIL))
        currentUser.signProviders.push(AuthProviderEnum.EMAIL);
    }

    return this.prismaService.user.update({
      where: { email: currentUser.email },
      data: currentUser,
    });
  }

  async signTokens(user) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ user }, this.jwtOptions.access),
      this.jwtService.signAsync({ user }, this.jwtOptions.refresh),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token) {
    return this.jwtService.verify(token, this.jwtOptions.access);
  }

  async verifyRefresshToken(token) {
    return this.jwtService.verify(token, this.jwtOptions.refresh);
  }

  async verifyPassword({ email, password }) {
    try {
      const currentUser = await this.prismaService.user.findFirstOrThrow({
        where: { email },
      });
      return !!(await bcrypt.compare(password, currentUser.password!));
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async verifyEmailToken(verifyEmailToken) {
    try {
      const currentUser = await this.prismaService.user.findFirstOrThrow({
        where: {
          verifyEmailToken,
        },
      });
      currentUser.verifyEmailToken = null;
      currentUser.signStatus = AuthStatusEnum.ACTIVE;
      return !!(await this.prismaService.user.update({
        where: { email: currentUser.email },
        data: currentUser,
      }));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signup(user) {
    const userExists = await this.prismaService.user.findFirst({
      where: { email: user.email },
    });
    if (userExists) throw new BadRequestException('User already exists');
    user.password = user.password ? await bcrypt.hash(user.password, 10) : null;
    user.signStatus = AuthStatusEnum.PENDING;
    user.signProviders = [AuthProviderEnum.EMAIL];
    user.verifyEmailToken = await bcrypt.hash(user.email, 10);
    return this.prismaService.user.create({
      data: user,
    });
  }
}
