import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Visibility } from '@/shared/constants/post.enum';
import { Media } from './media.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @OneToMany(() => Media, (media) => media.post)
  media: Media[];
}
