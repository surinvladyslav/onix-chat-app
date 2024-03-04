import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { ChatroomModule } from './chatroom/chatroom.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { SocketModule } from './socket/socket.module';
import { ChatroomService } from './chatroom/chatroom.service';
import { AuthGuard } from './auth/auth.guard';
import { MinioModule } from './minio/minio.module';
import { RedisIoAdapter } from './adapters/redis-io-adapter';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    AuthModule,
    SocketModule,
    UserModule,
    PrismaModule,
    MinioModule,
    ChatroomModule,
  ],
  controllers: [AppController],
  providers: [
    ChatroomService,
    PrismaService,
    JwtService,
    AuthGuard,
    RedisIoAdapter,
  ],
})
export class AppModule {}
