import { Module } from '@nestjs/common';
import HomeController from './home.controller';
import { ChatroomModule } from '@modules/chatroom/chatroom.module';

@Module({
  imports: [ChatroomModule],
  controllers: [HomeController],
})
export default class HomeModule {}
