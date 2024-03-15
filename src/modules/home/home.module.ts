import { Module } from '@nestjs/common';
import HomeController from './home.controller';
import HomeService from './home.service';
import { ChatroomModule } from '@modules/chatroom/chatroom.module';
import UsersModule from '@modules/users/users.module';
import { MinioModule } from '@providers/minio/minio.module';

@Module({
  imports: [ChatroomModule, UsersModule, MinioModule],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export default class HomeModule {}
