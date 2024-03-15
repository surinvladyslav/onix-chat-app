import { Module } from '@nestjs/common';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from '@providers/minio/minio.service';
import { ChatroomRepository } from '@modules/chatroom/chatroom.repository';
import UsersModule from '@modules/users/users.module';
import AuthModule from '@modules/auth/auth.module';
@Module({
  imports: [ConfigModule, UsersModule, AuthModule],
  controllers: [ChatroomController],
  providers: [ChatroomService, ChatroomRepository, MinioService],
  exports: [ChatroomService],
})
export class ChatroomModule {}
