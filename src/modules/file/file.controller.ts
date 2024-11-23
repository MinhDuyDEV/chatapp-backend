import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { UploadFileDto, UploadFileResponseDto } from './dto/upload-file.dto';

@UseGuards(JwtAccessTokenGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UploadFileDto,
  ): Promise<UploadFileResponseDto> {
    return this.fileService.upload(file, data);
  }

  @Post('multiple-upload')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadMultipleFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: UploadFileDto,
  ): Promise<UploadFileResponseDto[]> {
    return this.fileService.uploadMultiple(files, data);
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
