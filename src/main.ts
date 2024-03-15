import * as path from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import * as basicAuth from 'express-basic-auth';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@modules/app/app.module';
import { VersioningOptions } from '@nestjs/common/interfaces/version-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import NotFoundExceptionFilter from '@filters/not-found.exception.filter';
import { AllExceptionsFilter } from '@filters/all.exceptions.filter';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { PrismaClientExceptionFilter } from '@providers/prisma';
import { join } from 'path';
import { ThrottlerExceptionsFilter } from '@filters/throttler.exception.filter';
import BaseWsExceptionFilter from '@filters/base.ws.exception.filter';

async function bootstrap(): Promise<{ port: number }> {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {
      cors: true,
      bodyParser: true,
    });

  const configService: ConfigService<any, boolean> = app.get(ConfigService);
  const appConfig = configService.get('app');

  const swaggerConfig = configService.get('swagger');
  const sessionConfig = configService.get('session');

  app.enableCors();

  const viewsPath = join(__dirname, '../public/views');

  app.setBaseViewsDir(viewsPath);
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  app.use(session(sessionConfig));

  app.use(passport.initialize());
  app.use(passport.session());

  const optionsLogger = appConfig.loggerLevel;
  app.useLogger(optionsLogger);

  app.useGlobalPipes(new ValidationPipe());

  const optionsGlobalPrefix = {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  };

  app.setGlobalPrefix('api', optionsGlobalPrefix);

  const optionsVersioning: VersioningOptions = {
    type: VersioningType.URI,
    defaultVersion: '1',
  };

  app.enableVersioning(optionsVersioning);

  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: {
        admin: swaggerConfig.password,
      },
    }),
  );

  const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Onix Chat App API v1')
    .setDescription(
      'For more detailed information about the APIs and endpoints provided by the application, ' +
        'you can check the Swagger documentation',
    )
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new BaseWsExceptionFilter(),
    new NotFoundExceptionFilter(),
    new PrismaClientExceptionFilter(httpAdapter),
    new ThrottlerExceptionsFilter(),
  );

  await app.listen(appConfig.port);

  return appConfig;
}

bootstrap().then((appConfig) => {
  Logger.log(`Running in http://localhost:${appConfig.port}`, 'Bootstrap');
});
