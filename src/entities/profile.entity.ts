import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/user.entity';
import { IsDateString } from 'class-validator';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  bio?: string;

  @Column({ nullable: true })
  coverPhoto?: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  @IsDateString()
  birthday: string;

  @Column()
  gender: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  user: User;
}
