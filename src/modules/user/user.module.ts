import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/user.entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Services } from '@/shared/constants/services.enum';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FileModule],
  controllers: [UserController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
