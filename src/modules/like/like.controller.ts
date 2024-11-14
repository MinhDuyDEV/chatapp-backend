import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';

@UseGuards(JwtAccessTokenGuard)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('toggle-like/:postId')
  @HttpCode(HttpStatus.OK)
  async toggleLike(@AuthUser() user: User, @Param('postId') postId: string) {
    return await this.likeService.toggleLike(user.id, postId);
  }

  @Get('post/:postId')
  async getLikesByPost(
    @Param('postId') postId: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.likeService.getLikesByPost(postId, page, limit);
  }
}
