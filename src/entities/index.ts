import { User } from './user.entity';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Share } from './share.entity';
import { Group } from '@/entities/group.entity';
import { GroupMessage } from '@/entities/group-message.entity';
import { GroupMessageAttachment } from '@/entities/group-message-attachment.entity';
import { MessageAttachment } from '@/entities/message-attachment.entity';
import { Friend } from './friend.entity';
import { FriendRequest } from './friend-request.entity';
import { Profile } from '@/entities/profile.entity';
import { Peer } from '@/entities/peer.entity';
import { UserPresence } from '@/entities/user-presence.entity';
import { PostAttachment } from './post-attachment.entity';
import { AvatarAttachment } from './avatar-attachment.entity';
import { Follow } from '@/entities/follow.entity';
import { Notification } from '@/entities/notification.entity';

const entities = [
  User,
  Conversation,
  Message,
  Post,
  Like,
  Comment,
  Share,
  MessageAttachment,
  Post,
  File,
  Group,
  GroupMessage,
  GroupMessageAttachment,
  Friend,
  FriendRequest,
  Follow,
  Notification,
  Profile,
  Peer,
  UserPresence,
  PostAttachment,
  AvatarAttachment,
];

export {
  User,
  Conversation,
  Message,
  Post,
  Like,
  Comment,
  Share,
  PostAttachment,
  AvatarAttachment,
};

export default entities;
