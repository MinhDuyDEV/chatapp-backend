import { Entity, ManyToOne } from 'typeorm';
import { File } from './file.entity';
import { Post } from './post.entity';

@Entity('post_attachments')
export class PostAttachment extends File {
  @ManyToOne(() => Post, (post) => post.attachments, { onDelete: 'CASCADE' })
  post: Post;
}
