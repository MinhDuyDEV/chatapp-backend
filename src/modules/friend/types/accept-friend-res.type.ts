import { Friend } from '@/entities/friend.entity';
import { FriendRequest } from '@/entities/user-request.entity';

export type AcceptFriendResponse = {
  friend: Friend;
  friendRequest: FriendRequest;
};
