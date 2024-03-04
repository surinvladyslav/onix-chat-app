import * as path from 'path';
import * as cookieParser from 'cookie-parser';

import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisIoAdapter } from './adapters/redis-io-adapter';

function setupSwaggerForApp(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Onix Chat App API')
    .setDescription(
      'For more detailed information about the APIs and endpoints provided by the application, ' +
        'you can check the Swagger documentation',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT');

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  app.use(cookieParser());
  app.enableCors();

  app.setBaseViewsDir(path.join(__dirname, '..', 'views', 'pages'));
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  setupSwaggerForApp(app);

  await app.listen(port, () => {
    Logger.log(`Server is running on ${port} port`);
  });
}

bootstrap();
