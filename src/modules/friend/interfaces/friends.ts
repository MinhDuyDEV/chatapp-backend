import { Friend } from '@/entities/friend.entity';
import { DeleteFriendRequestParams } from '@/modules/friend/types/delete-friend-req-params.type';

export interface IFriendsService {
  getFriends(id: string): Promise<Friend[]>;
  findFriendById(id: string): Promise<Friend>;
  deleteFriend(params: DeleteFriendRequestParams);
  isFriends(userOneId: string, userTwoId: string): Promise<Friend | undefined>;
}
