import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @Column({ default: 0 })
  left: number;

  @Column({ default: 0 })
  right: number;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  parent: Comment;
}
