import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
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
import { ConversationService } from '@/modules/conversation/conversation.service';
import { Message } from '@/entities/message.entity';

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
    private readonly conversationService: ConversationService,
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

  @SubscribeMessage('onConversationJoin')
  onConversationJoin(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    Logger.log(
      `${client.user?.id} joined a Conversation of ID: ${data.conversationId}`,
    );
    client.join(`conversation-${data.conversationId}`);
    Logger.log(JSON.stringify(client.rooms));
    client.to(`conversation-${data.conversationId}`).emit('userJoin');
  }

  @SubscribeMessage('onConversationLeave')
  onConversationLeave(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    Logger.log('onConversationLeave');
    client.leave(`conversation-${data.conversationId}`);
    Logger.log(JSON.stringify(client.rooms));
    client.to(`conversation-${data.conversationId}`).emit('userLeave');
  }

  @SubscribeMessage('onTypingStart')
  onTypingStart(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    Logger.log('onTypingStart');
    Logger.log(data.conversationId);
    Logger.log(JSON.stringify(client.rooms));
    client.to(`conversation-${data.conversationId}`).emit('onTypingStart');
  }

  @SubscribeMessage('onTypingStop')
  onTypingStop(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    Logger.log('onTypingStop');
    Logger.log(data.conversationId);
    Logger.log(JSON.stringify(client.rooms));
    client.to(`conversation-${data.conversationId}`).emit('onTypingStop');
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

  @OnEvent('message.update')
  async handleMessageUpdate(message: Message) {
    const {
      author,
      conversation: { creator, recipient },
    } = message;
    console.log(message);
    const recipientSocket =
      author.id === creator.id
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);
    if (recipientSocket) recipientSocket.emit('onMessageUpdate', message);
  }

  @OnEvent('message.delete')
  async handleMessageDelete(payload: {
    userId: string;
    messageId: string;
    conversationId: string;
  }) {
    console.log('message.delete');
    const conversation = await this.conversationService.findConversationById(
      payload.conversationId,
    );
    if (!conversation) return;
    const { creator, recipient } = conversation;
    const recipientSocket =
      creator.id === payload.userId
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);
    if (recipientSocket) recipientSocket.emit('onMessageDelete', payload);
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
