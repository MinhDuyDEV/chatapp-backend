import { Visibility } from '@/shared/constants/post.enum';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  visibility?: Visibility;
}
