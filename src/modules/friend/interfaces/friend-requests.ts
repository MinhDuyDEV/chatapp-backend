import { FriendRequestParams } from '@/modules/friend/types/friend-req-params.type';
import { AcceptFriendResponse } from '@/modules/friend/types/accept-friend-res.type';
import { FriendRequest } from '@/entities/user-request.entity';
import { CancelFriendRequestParams } from '@/modules/friend/types/cancel-friend-req-params.type';
import { CreateFriendParams } from '@/modules/friend/types/create-friend-params.type';

export interface IFriendRequestService {
  accept(params: FriendRequestParams): Promise<AcceptFriendResponse>;
  cancel(params: CancelFriendRequestParams): Promise<FriendRequest>;
  create(params: CreateFriendParams);
  reject(params: CancelFriendRequestParams): Promise<FriendRequest>;
  getFriendRequests(userId: string): Promise<FriendRequest[]>;
  isPending(userOneId: string, userTwoId: string);
  findById(id: string): Promise<FriendRequest>;
}
