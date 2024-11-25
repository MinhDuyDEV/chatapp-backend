import { BaseFileResponseDto } from '@/modules/file/dto/base-file-response.dto';
import { Visibility } from '@/shared/constants/visibility.enum';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  visibility: Visibility;

  @IsArray()
  attachmentIds?: BaseFileResponseDto[];
}
