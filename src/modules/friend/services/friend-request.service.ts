import { Inject, Injectable } from '@nestjs/common';
import { IFriendRequestService } from '@/modules/friend/interfaces/friend-requests';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from '@/entities/friend.entity';
import { Repository } from 'typeorm';
import { FriendRequest } from '@/entities/friend-request.entity';
import { Services } from '@/shared/constants/services.enum';
import { IFriendsService } from '@/modules/friend/interfaces/friends';
import { IUserService } from '@/modules/user/users';
import { FriendRequestParams } from '@/modules/friend/types/friend-req-params.type';
import { AcceptFriendResponse } from '@/modules/friend/types/accept-friend-res.type';
import { CancelFriendRequestParams } from '@/modules/friend/types/cancel-friend-req-params.type';
import { CreateFriendParams } from '@/modules/friend/types/create-friend-params.type';

@Injectable()
export class FriendRequestService implements IFriendRequestService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendsService: IFriendsService,
  ) {}

  accept(params: FriendRequestParams): Promise<AcceptFriendResponse> {
    return Promise.resolve(undefined);
  }

  cancel(params: CancelFriendRequestParams): Promise<FriendRequest> {
    return Promise.resolve(undefined);
  }

  create(params: CreateFriendParams) {}

  findById(id: string): Promise<FriendRequest> {
    return Promise.resolve(undefined);
  }

  getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const status = 'pending';
    return this.friendRequestRepository.find({
      where: [
        { sender: { id: userId }, status },
        { receiver: { id: userId }, status },
      ],
      relations: ['sender', 'receiver', 'receiver.profile', 'sender.profile'],
    });
  }

  isPending(userOneId: string, userTwoId: string) {}

  reject(params: CancelFriendRequestParams): Promise<FriendRequest> {
    return Promise.resolve(undefined);
  }
}
