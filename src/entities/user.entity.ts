import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { Message } from './message.entity';
import { Post } from './post.entity';
import { Group } from '@/entities/group.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];

  @ManyToMany(() => Group, (group) => group.users)
  groups: Group[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
