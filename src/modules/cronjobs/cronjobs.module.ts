import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { CronjobsController } from './cronjobs.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from '../file/file.module';

@Module({
  imports: [ScheduleModule.forRoot(), FileModule],
  controllers: [CronjobsController],
  providers: [CronjobsService],
})
export class CronjobsModule {}
