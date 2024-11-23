import { Controller, Put } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';

@Controller('cronjobs')
export class CronjobsController {
  constructor(private readonly cronjobsService: CronjobsService) {}

  @Put('clean-up-junk-files')
  async cleanUpJunkFiles() {
    return this.cronjobsService.handleCronCleanUpJunkFiles();
  }
}
