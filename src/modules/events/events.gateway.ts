import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerToClientEvents } from '@/modules/events/types/events';
import { Logger, Inject } from '@nestjs/common';
import { SocketAuthMiddleware } from '@/modules/auth/ws.mw';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthenticatedSocket } from '@/modules/events/types';
import { GatewaySessionManager } from '@/modules/events/gateway-session-manager';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateMessageResponse } from '@/modules/message/dto/message-response.dto';
import { Conversation } from '@/entities/conversation.entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly sessions: GatewaySessionManager,
  ) {}

  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  afterInit(server: AuthenticatedSocket) {
    server.use(SocketAuthMiddleware(this.authService) as any);
  }

  handleConnection(socket: AuthenticatedSocket, ...args: any[]): any {
    Logger.log('user connected in socket', JSON.stringify(socket.user));
    Logger.log('handleConnection');
    this.sessions.setUserSocket(socket.user.id, socket);
  }

  handleDisconnect(socket: AuthenticatedSocket): any {
    Logger.log('user disconnected in socket', JSON.stringify(socket.user));
    Logger.log('handleDisconnect');
    this.sessions.removeUserSocket(socket.user.id);
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: CreateMessageResponse) {
    const usersInSocket = this.sessions.getSockets();
    const userIds = Array.from(usersInSocket.keys());
    Logger.log('message.create event', JSON.stringify(userIds));

    const { message, conversation } = payload;

    const authorSocket = this.sessions.getUserSocket(message.author.id);
    const recipientSocket =
      message.author.id === conversation.creator.id
        ? this.sessions.getUserSocket(conversation.recipient.id)
        : this.sessions.getUserSocket(conversation.creator.id);

    if (authorSocket) authorSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
  }

  @OnEvent('conversation.create')
  handleConversationCreateEvent(payload: Conversation) {
    console.log('conversation.create');
    const creatorSocket = this.sessions.getUserSocket(payload.creator.id);
    const recipientSocket = this.sessions.getUserSocket(payload.recipient.id);

    if (creatorSocket) creatorSocket.emit('onConversation', payload);
    if (recipientSocket) recipientSocket.emit('onConversation', payload);
  }
}
