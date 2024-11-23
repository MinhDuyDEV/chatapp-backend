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
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadFileDto, UploadFileResponseDto } from './dto/upload-file.dto';

@UseGuards(JwtAccessTokenGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({ limits: { fileSize: 1024 * 1024 * 5 } }),
  ) // 5MB
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: UploadFileDto,
  ) {
    return this.fileService.uploadFiles(files, data);
  }

  @Post('upload-message')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFileMessage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: UploadFileDto,
  ): Promise<UploadFileResponseDto[]> {
    console.log('uploadFileMessage controller', { files, data });
    return this.fileService.uploadFiles(files, data);
  }
}
