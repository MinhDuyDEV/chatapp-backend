import { User } from './user.entity';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';
import { Post } from './post.entity';
import { File } from './file.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Share } from './share.entity';
import { Group } from '@/entities/group.entity';
import { GroupMessage } from '@/entities/group-message.entity';
import { GroupMessageAttachment } from '@/entities/group-message-attachment.entity';
import { MessageAttachment } from '@/entities/message-attachment.entity';
import { Friend } from './friend.entity';
import { FriendRequest } from './user-request.entity';
import { Profile } from '@/entities/profile.entity';
import { Peer } from '@/entities/peer.entity';
import { UserPresence } from '@/entities/user-presence.entity';

const entities = [
  User,
  Conversation,
  Message,
  Post,
  File,
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
  Profile,
  Peer,
  UserPresence,
];

export { User, Conversation, Message, Post, File, Like, Comment, Share };

export default entities;
