import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Visibility } from '@/shared/constants/visibility.enum';
import { File } from './file.entity';
import { BaseEntity } from './base.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Share } from './share.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @OneToMany(() => File, (file) => file.post)
  files: File[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Share, (share) => share.post)
  shares: Share[];
}
