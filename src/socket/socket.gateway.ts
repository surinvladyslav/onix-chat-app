import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { ChatroomService } from '../chatroom/chatroom.service';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly chatroomService: ChatroomService,
  ) {
    console.log('Socket server initialized');
  }

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);

    this.socketService.handleConnection(client);

    try {
      const token = client.handshake.headers.cookie
        .split('; ')
        .find((cookie: string) => cookie.startsWith('access_token'))
        .split('=')[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decodedToken['sub'];
      if (!userId) {
        throw new UnauthorizedException('Invalid token');
      }

      const requestUrl = new URL(client.handshake.headers.referer);
      const chatroomId = parseInt(requestUrl.pathname.split('/').pop());

      client.data.userId = userId;
      client.data.chatroomId = chatroomId;
    } catch (error) {
      console.error('Error handling connection:', error);
      client.emit('errorMessage', 'Unauthorized');
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(socket: Socket, message: string): Promise<void> {
    const userId = socket.data.userId;
    const chatroomId = socket.data.chatroomId;

    if (!userId || !chatroomId) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const savedMessage = await this.chatroomService.sendMessage(
        chatroomId,
        message,
        userId,
      );

      this.server.emit('message', savedMessage);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('errorMessage', 'Error handling message');
    }
  }
}
