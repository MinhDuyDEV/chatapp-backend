import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Visibility } from '@/shared/constants/visibility.enum';
import { BaseEntity } from './base.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Share } from './share.entity';
import { PostAttachment } from './post-attachment.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @Column({
    type: 'enum',
    enum: Visibility,
  })
  visibility: Visibility;

  @OneToMany(() => PostAttachment, (postAttachment) => postAttachment.post)
  attachments: PostAttachment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Share, (share) => share.post)
  shares: Share[];
}
