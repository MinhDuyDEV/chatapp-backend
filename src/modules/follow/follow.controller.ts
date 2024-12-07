import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { UserBasicInfoDto } from '../user/dto/user-basic-info.dto';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { Services } from '@/shared/constants/services.enum';

@Controller('follow')
export class FollowController {
  constructor(
    @Inject(Services.FOLLOW_SERVICE)
    private readonly followService: FollowService,
  ) {}

  @Post(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async followUser(
    @AuthUser() user: User,
    @Param('userId') followingId: string,
  ): Promise<void> {
    await this.followService.followUser(user.id, followingId);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollowUser(
    @AuthUser() user: User,
    @Param('userId') followingId: string,
  ): Promise<void> {
    await this.followService.unfollowUser(user.id, followingId);
  }

  @Get(':userId/followers')
  async getUserFollowers(
    @Param('userId') userId: string,
  ): Promise<UserBasicInfoDto[]> {
    return this.followService.getFollowers(userId);
  }

  @Get(':userId/following')
  async getUserFollowing(
    @Param('userId') userId: string,
  ): Promise<UserBasicInfoDto[]> {
    return this.followService.getFollowing(userId);
  }

  @Get(':userId/is-following')
  async isFollowing(
    @AuthUser() user: User,
    @Param('userId') followingId: string,
  ): Promise<boolean> {
    return this.followService.isFollowing(user.id, followingId);
  }

  @Get(':userId/followers/count')
  async getFollowersCount(@Param('userId') userId: string): Promise<number> {
    return this.followService.countFollowers(userId);
  }

  @Get(':userId/following/count')
  async getFollowingCount(@Param('userId') userId: string): Promise<number> {
    return this.followService.countFollowing(userId);
  }
}
