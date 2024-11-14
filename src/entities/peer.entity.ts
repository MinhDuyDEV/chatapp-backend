import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/entities/user.entity';

@Entity()
export class Peer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.peer)
  user: User;
}
