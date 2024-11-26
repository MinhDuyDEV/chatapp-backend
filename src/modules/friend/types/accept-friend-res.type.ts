import { Friend } from '@/entities/friend.entity';
import { FriendRequest } from '@/entities/friend-request.entity';

export type AcceptFriendResponse = {
  friend: Friend;
  friendRequest: FriendRequest;
};
