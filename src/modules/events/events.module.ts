import { Module } from '@nestjs/common';
import EventsGateway from './events.gateway';
import { ChatroomModule } from '@modules/chatroom/chatroom.module';

@Module({
  imports: [ChatroomModule],
  providers: [EventsGateway],
})
export default class EventsModule {}
