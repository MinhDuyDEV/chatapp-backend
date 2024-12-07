import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { RejectFriendRequestDto, SendFriendRequestDto } from './dto/friend.dto';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { Services } from '@/shared/constants/services.enum';
import { UserRelationship } from './types/user-relationship.type';

@Controller('friends')
export class FriendController {
  constructor(
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendService: FriendService,
  ) {}

  @Get(':userId')
  async getFriends(@Param('userId') userId: string) {
    return await this.friendService.getFriends(userId);
  }

  @Get('mutual/:otherUserId')
  async getMutualFriends(
    @AuthUser() { id: userId }: User,
    @Param('otherUserId') otherUserId: string,
  ) {
    return await this.friendService.getMutualFriends(userId, otherUserId);
  }

  @Get('count/:userId')
  async countFriends(@Param('userId') userId: string) {
    return {
      total: await this.friendService.countFriends(userId),
    };
  }

  @Post('requests')
  async sendFriendRequest(
    @AuthUser() { id: userId }: User,
    @Body() dto: SendFriendRequestDto,
  ) {
    if (userId === dto.receiverId) {
      throw new BadRequestException(
        'You cannot send friend request to yourself',
      );
    }

    return await this.friendService.sendFriendRequest(
      userId,
      dto.receiverId,
      dto.message,
    );
  }

  @Delete('requests/cancel/:requestId')
  async cancelFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('requestId') requestId: string,
  ) {
    return await this.friendService.cancelFriendRequest(userId, requestId);
  }

  @Get('requests/sent')
  async getSentRequests(@AuthUser() { id: userId }: User) {
    return await this.friendService.getSentFriendRequests(userId);
  }

  @Get('requests/received')
  async getReceivedRequests(@AuthUser() { id: userId }: User) {
    return await this.friendService.getReceivedFriendRequests(userId);
  }

  @Put('requests/:requestId/accept')
  async acceptFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('requestId') requestId: string,
  ) {
    return await this.friendService.acceptFriendRequest(userId, requestId);
  }

  @Put('requests/:requestId/reject')
  async rejectFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('requestId') requestId: string,
    @Body() dto: RejectFriendRequestDto,
  ) {
    return await this.friendService.rejectFriendRequest(
      userId,
      requestId,
      dto.reason,
    );
  }

  @Get(':userId/relationship')
  async getRelationship(
    @AuthUser() user: User,
    @Param('userId') userId: string,
  ): Promise<UserRelationship> {
    return this.friendService.getRelationship(user.id, userId);
  }

  @Delete('/cancel/:userId')
  async cancelFriend(
    @AuthUser() user: User,
    @Param('userId') targetUserId: string,
  ) {
    if (user.id === targetUserId) {
      throw new BadRequestException(
        'You cannot cancel friendship with yourself',
      );
    }
    return await this.friendService.cancelFriend(user.id, targetUserId);
  }
}
