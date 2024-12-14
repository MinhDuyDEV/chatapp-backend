import { Expose } from 'class-transformer';
import { FriendRequestStatus } from '../types/user-relationship.type';

export class UserRelationshipDto {
  @Expose()
  requestId: string;

  @Expose()
  isFollowing: boolean;

  @Expose()
  isFriend: boolean;

  @Expose()
  hasPendingFriendRequest: boolean;

  @Expose()
  pendingFriendRequestType?: 'sent' | 'received';

  @Expose()
  friendRequestStatus: FriendRequestStatus;
}
