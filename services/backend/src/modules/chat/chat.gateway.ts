import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatEventEnum } from '../../utils/chat.enum';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway(Number(process.env.BACKEND_SOCKET_PORT), {
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  protected server;

  @SubscribeMessage(ChatEventEnum.MESSAGE_SEND)
  @UseGuards(WsJwtGuard)
  async handleMessage(client, payload) {
    this.server.emit(ChatEventEnum.MESSAGE_RECEIVED, payload);
  }
}
