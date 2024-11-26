import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto, UploadFileResponseDto } from './dto/upload-file.dto';

@UseGuards(JwtAccessTokenGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 * 5 } }),
  )
  async uploadFile(
    @UploadedFiles() file: Express.Multer.File,
    @Body() data: UploadFileDto,
  ): Promise<UploadFileResponseDto> {
    return this.fileService.upload(file, data);
  }

  @Post('multiple')
  @UseInterceptors(
    AnyFilesInterceptor({ limits: { fileSize: 1024 * 1024 * 100 } }),
  )
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: UploadFileDto,
  ): Promise<UploadFileResponseDto[]> {
    return this.fileService.uploadFiles(files, data);
  }
}
