import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/user.entity';
import { IsDateString } from 'class-validator';
import { CoverPhotoAttachment } from './cover-photo-attachment.entity';
import { SocialLink } from '@/shared/types/social-link';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  bio?: string;

  @Column({ nullable: true })
  @OneToOne(
    () => CoverPhotoAttachment,
    (coverPhotoAttachment) => coverPhotoAttachment.profile,
  )
  coverPhoto?: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  @IsDateString()
  birthday: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @Column('json', { nullable: true })
  socialLinks: SocialLink[];

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  user: User;
}
