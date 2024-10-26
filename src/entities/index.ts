import { User } from './user.entity';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';

const entities = [User, Conversation, Message, Comment, Post, Like];

export { User, Conversation, Message };

export default entities;
