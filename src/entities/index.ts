import { User } from './user.entity';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';
import { Post } from './post.entity';
import { Media } from './media.entity';

const entities = [User, Conversation, Message, Post, Media];

export { User, Conversation, Message, Post, Media };

export default entities;
