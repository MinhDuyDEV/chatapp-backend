import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

// import { ExpiredTokenFilter } from '@/shared/filters/expired-token.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = +configService.get('PORT');

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  // app.useGlobalFilters(new ExpiredTokenFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: ['http://localhost:5173'], credentials: true });

  await app.listen(port);
}
bootstrap();
