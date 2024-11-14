import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  about?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  banner?: string;

  @OneToOne(() => User)
  user: User;
}
