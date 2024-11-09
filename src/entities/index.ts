import { User } from './user.entity';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';
import { Post } from './post.entity';
import { File } from './file.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Share } from './share.entity';

const entities = [
  User,
  Conversation,
  Message,
  Post,
  File,
  Like,
  Comment,
  Share,
];

export { User, Conversation, Message, Post, File, Like, Comment, Share };

export default entities;
