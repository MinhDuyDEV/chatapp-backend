import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

@Catch(TokenExpiredError)
export class ExpiredTokenFilter implements ExceptionFilter {
  catch(exception: TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.GONE).json({
      statusCode: HttpStatus.GONE,
      message: 'Access token has expired',
    });
  }
}
