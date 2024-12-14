import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/entities/user.entity';
// import { NotificationType } from '@/enums/notification-type.enum';

export enum NotificationType {
  LIKE_POST = 'LIKE_POST',
  COMMENT = 'COMMENT',
  ADD_FRIEND = 'ADD_FRIEND',
  SHARE_POST = 'SHARE_POST',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ default: false })
  read: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
