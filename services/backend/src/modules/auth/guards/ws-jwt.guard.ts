import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { ChatEventEnum } from 'src/utils/chat.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context) {
    const client = context.switchToWs().getClient();
    try {
      const user = await this.authService.verifyAccessToken(
        client.handshake.headers.authorization.split(' ')[1]
      );
      if (user) context.switchToWs().getClient().user = user;

      return user as boolean;
    } catch (error) {
      client.emit(
        ChatEventEnum.CHAT_LOG,
        new UnauthorizedException(error.message)
      );
      return false;
    }
  }
}
