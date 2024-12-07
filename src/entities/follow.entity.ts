import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/entities/user.entity';
import { BaseEntity } from './base.entity';

@Entity('follows')
export class Follow extends BaseEntity {
  @ManyToOne(() => User, (user) => user.followers, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.following, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId' })
  following: User;
}
