import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@config/app.config';
import swaggerConfig from '@config/swagger.config';
import sessionConfig from '@config/session.config';
import minioConfig from '@config/minio.config';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { loggingMiddleware, createUserMiddleware } from '@providers/prisma';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatroomModule } from '@modules/chatroom/chatroom.module';
import AuthModule from '@modules/auth/auth.module';
import AppGateway from '@modules/events/events.gateway';
import UsersModule from '@modules/users/users.module';
import HomeModule from '@modules/home/home.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.example',
      load: [appConfig, swaggerConfig, minioConfig, sessionConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public'),
      serveRoot: '/public',
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(), createUserMiddleware()],
      },
    }),
    AuthModule,
    UsersModule,
    HomeModule,
    ChatroomModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
