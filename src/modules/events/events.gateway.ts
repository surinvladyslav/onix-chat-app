import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomService } from '../chatroom/chatroom.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export default class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('EventsGateway');
  constructor(private readonly chatroomService: ChatroomService) {}

  public afterInit(server: Server): void {
    this.server = server;
    return this.logger.log('Socket server initialized');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    socket: Socket,
    data: { chatroomId: string; message: string; userId: string },
  ): Promise<void> {
    const { chatroomId, message, userId } = data;

    try {
      const savedMessage = await this.chatroomService.saveMessage(
        {
          chatroomId: parseInt(chatroomId, 10),
          content: message,
        },
        parseInt(userId, 10),
      );

      this.server.emit('message', savedMessage);
    } catch (error) {
      socket.emit('errorMessage', 'Error handling message');
    }
  }
}
