import { Visibility } from '@/shared/constants/visibility.enum';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  visibility?: Visibility;

  @IsArray()
  @IsUUID('4', { each: true })
  fileIds?: string[];
}
