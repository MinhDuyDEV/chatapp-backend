import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('shares')
export class Share extends BaseEntity {
  @ManyToOne(() => User, (user) => user.shares, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.shares, { onDelete: 'CASCADE' })
  post: Post;
}
