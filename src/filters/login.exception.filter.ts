import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export default class LoginExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof NotFoundException) {
      response.redirect('/api/v1/auth/login');
    } else if (exception instanceof UnauthorizedException) {
      response.redirect('/api/v1/auth/login');
    }
  }
}
