import { Exclude } from 'class-transformer';
import { Entity, Column, OneToMany, ManyToMany, OneToOne } from 'typeorm';
import { Message } from './message.entity';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Share } from './share.entity';
import { BaseEntity } from './base.entity';
import { Group } from '@/entities/group.entity';
import { Profile } from '@/entities/profile.entity';
import { Peer } from '@/entities/peer.entity';
import { UserPresence } from '@/entities/user-presence.entity';
import { AvatarAttachment } from './avatar-attachment.entity';
import { Follow } from '@/entities/follow.entity';
import { Notification } from '@/entities/notification.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  @OneToOne(() => AvatarAttachment, (avatarAttachment) => avatarAttachment.user)
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

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Share, (share) => share.user)
  shares: Share[];

  @OneToOne(() => Profile, { cascade: ['insert', 'update'] })
  profile: Profile;

  @OneToOne(() => UserPresence, { cascade: ['insert', 'update'] })
  presence: UserPresence;

  @OneToOne(() => Peer, (peer) => peer.user, {
    cascade: ['insert', 'remove', 'update'],
  })
  peer: Peer;

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  following: Follow[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
