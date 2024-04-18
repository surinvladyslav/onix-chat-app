import { Module } from '@nestjs/common';
import HomeController from './home.controller';
import { ChatroomModule } from '@modules/chatroom/chatroom.module';
import UsersModule from '@modules/users/users.module';
import { MinioModule } from '@providers/minio/minio.module';

@Module({
  imports: [ChatroomModule, UsersModule, MinioModule],
  controllers: [HomeController],
})
export default class HomeModule {}
