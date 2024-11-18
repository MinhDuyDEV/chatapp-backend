import { Injectable, Logger } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronjobsService {
  constructor(private readonly fileService: FileService) {}
  private readonly logger = new Logger(CronjobsService.name);

  // Runs at 2 AM every day
  @Cron('0 2 * * *')
  async handleCronCleanUpJunkFiles() {
    this.logger.warn('Running clean up junk files task');
    await this.fileService.cleanUpJunkFiles();
  }
}
