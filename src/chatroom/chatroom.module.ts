import { Module } from '@nestjs/common';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MinioService } from '../minio/minio.service';
import { MinioConfigService } from '../minio/minio.config';

@Module({
  imports: [ConfigModule, UserModule, AuthModule],
  controllers: [ChatroomController],
  providers: [
    ChatroomService,
    PrismaService,
    JwtService,
    MinioService,
    MinioConfigService,
  ],
  exports: [ChatroomService],
})
export class ChatroomModule {}
