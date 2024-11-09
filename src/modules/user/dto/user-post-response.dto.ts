import { Exclude } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class UserPostResponseDto extends UserResponseDto {
  @Exclude()
  email: string;
}
