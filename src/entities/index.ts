import { User } from './user.entity';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';
import { Post } from './post.entity';
import { File } from './file.entity';

const entities = [User, Conversation, Message, Post, File];

export { User, Conversation, Message, Post, File };

export default entities;
