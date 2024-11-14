import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ROUTES } from '@/shared/constants/routes.enum';
import { Services } from '@/shared/constants/services.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IFriendRequestService } from '@/modules/friend/interfaces/friend-requests';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { User } from '@/entities/user.entity';
import { CreateFriendDto } from '@/modules/friend/dto/create-friend.dto';

@Controller(ROUTES.FRIEND_REQUESTS)
export class FriendRequestController {
  constructor(
    @Inject(Services.FRIENDS_REQUESTS_SERVICE)
    private readonly friendRequestService: IFriendRequestService,
    private event: EventEmitter2,
  ) {}

  @Get()
  getFriendRequests(@AuthUser() user: User) {
    return this.friendRequestService.getFriendRequests(user.id);
  }

  // @Throttle(3, 10)
  @Post()
  async createFriendRequest(
    @AuthUser() user: User,
    @Body() { username }: CreateFriendDto,
  ) {
    const params = { user, username };
    const friendRequest = await this.friendRequestService.create(params);
    this.event.emit('friend-request.create', friendRequest);
    return friendRequest;
  }

  // @Throttle(3, 10)
  @Patch(':id/accept')
  async acceptFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const response = await this.friendRequestService.accept({ id, userId });
    // this.event.emit(ServerEvents.FRIEND_REQUEST_ACCEPTED, response);
    return response;
  }

  // @Throttle(3, 10)
  @Delete(':id/cancel')
  async cancelFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const response = await this.friendRequestService.cancel({ id, userId });
    // this.event.emit('friend-request.cancel', response);
    return response;
  }

  // @Throttle(3, 10)
  @Patch(':id/reject')
  async rejectFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const response = await this.friendRequestService.reject({ id, userId });
    // this.event.emit(ServerEvents.FRIEND_REQUEST_REJECTED, response);
    return response;
  }
}
