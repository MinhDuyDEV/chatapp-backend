import { Visibility } from '@/shared/constants/visibility.enum';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  visibility?: Visibility;
}
