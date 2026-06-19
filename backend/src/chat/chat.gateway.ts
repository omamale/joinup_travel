import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody,
  ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'], credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');
  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      const payload = this.jwtService.verify(token);
      this.connectedUsers.set(client.id, payload.sub);
      client.data.userId = payload.sub;

      // Join personal room
      client.join(`user:${payload.sub}`);
      this.logger.log(`Client connected: ${client.id} (userId: ${payload.sub})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    this.connectedUsers.delete(client.id);
    if (userId) this.server.to(`user:${userId}`).emit('user:offline', { userId });
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('conversation:join')
  handleJoinConversation(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.join(`conversation:${data.conversationId}`);
    return { event: 'joined', conversationId: data.conversationId };
  }

  @SubscribeMessage('conversation:leave')
  handleLeaveConversation(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.leave(`conversation:${data.conversationId}`);
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string; type?: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    const message = await this.chatService.saveMessage({
      content: data.content,
      type: data.type || 'TEXT',
      senderId: userId,
      conversationId: data.conversationId,
    });

    this.server.to(`conversation:${data.conversationId}`).emit('message:received', message);
    return message;
  }

  @SubscribeMessage('message:read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    await this.chatService.markAsRead(data.conversationId, userId);
    this.server.to(`conversation:${data.conversationId}`).emit('message:read', {
      conversationId: data.conversationId,
      userId,
    });
  }

  @SubscribeMessage('user:typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    const userId = client.data.userId;
    client.to(`conversation:${data.conversationId}`).emit('user:typing', { userId, conversationId: data.conversationId });
  }

  @SubscribeMessage('user:stop-typing')
  handleStopTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    const userId = client.data.userId;
    client.to(`conversation:${data.conversationId}`).emit('user:stop-typing', { userId, conversationId: data.conversationId });
  }

  @SubscribeMessage('location:share')
  handleLocationShare(@ConnectedSocket() client: Socket, @MessageBody() data: { tripId: string; lat: number; lng: number }) {
    const userId = client.data.userId;
    this.server.to(`trip:${data.tripId}`).emit('location:update', { userId, ...data });
  }

  @SubscribeMessage('sos:alert')
  async handleSOS(@ConnectedSocket() client: Socket, @MessageBody() data: { lat: number; lng: number; tripId?: string }) {
    const userId = client.data.userId;
    this.server.emit('sos:alert', { userId, ...data, timestamp: new Date() });
  }
}
