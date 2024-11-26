import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/entities/user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.followers, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  follower: User;

  @ManyToOne(() => User, (user) => user.following, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  following: User;

  @CreateDateColumn()
  createdAt: number;
}
