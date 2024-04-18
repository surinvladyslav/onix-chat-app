import {
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { NOT_FOUND } from '@constants/errors.constants';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: any) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    if (req.url === '/favicon.ico') {
      return;
    }

    const status: number = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.NOT_FOUND;

    if (status === HttpStatus.NOT_FOUND) {
      return res.render('page-not-found');
    }

    const exceptionResponse = {
      success: false,
      error: {
        code: parseInt(NOT_FOUND.split(':')[0], 10),
        message: NOT_FOUND.split(':')[1].trim(),
        details: exception.getResponse(),
      },
    };

    return res.status(status).json(exceptionResponse);
  }
}
