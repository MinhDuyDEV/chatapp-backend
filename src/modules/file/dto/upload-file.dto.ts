import { FileType } from '@/shared/constants/file-type';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsEnum(FileType)
  type: FileType;
}

export class UploadFileResponseDto {
  id: string;
  url: string;
}
