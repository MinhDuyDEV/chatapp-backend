import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Visibility } from '@/shared/constants/visibility.enum';
import { File } from './file.entity';
import { BaseEntity } from './base.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @OneToMany(() => File, (file) => file.post)
  file: File[];
}
