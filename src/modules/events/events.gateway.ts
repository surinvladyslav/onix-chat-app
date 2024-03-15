import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomService } from '../chatroom/chatroom.service';

@WebSocketGateway()
export default class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly chatroomService: ChatroomService) {
    console.log('Socket server initialized');
  }

  afterInit(server: Server) {
    this.server = server;
    console.log('Socket server initialized');
  }

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    socket: Socket,
    data: { chatroomId: string; message: string; userId: string },
  ): Promise<void> {
    const { chatroomId, message, userId } = data;

    try {
      const savedMessage = await this.chatroomService.sendMessage(
        parseInt(chatroomId, 10),
        message,
        parseInt(userId, 10),
      );

      this.server.emit('message', savedMessage);
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('errorMessage', 'Error handling message');
    }
  }
}
