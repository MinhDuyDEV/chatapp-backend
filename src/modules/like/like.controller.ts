import { Body, Controller, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('toggle-like')
  async toggleLike(@Body() body: ToggleLikeDto, @AuthUser() user: User) {
    const { postId } = body;
    return await this.likeService.toggleLike(user, postId);
  }
}
