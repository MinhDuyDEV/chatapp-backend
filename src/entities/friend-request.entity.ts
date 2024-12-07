import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/entities/user.entity';
import { BaseEntity } from './base.entity';
import { FriendRequestStatus } from '@/modules/friend/types/user-relationship.type';

@Entity({ name: 'friend_requests' })
export class FriendRequest extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  @JoinColumn()
  receiver: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected', 'none'],
    default: 'none',
  })
  status: FriendRequestStatus;

  @Column({ nullable: true })
  message?: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  respondedAt?: Date;
}
