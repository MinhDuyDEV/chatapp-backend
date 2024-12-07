export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  NONE = 'none',
}

export type UserRelationship = {
  requestId: string;
  isFollowing: boolean;
  isFriend: boolean;
  hasPendingFriendRequest: boolean;
  pendingFriendRequestType?: 'sent' | 'received';
  friendRequestStatus: FriendRequestStatus;
};
