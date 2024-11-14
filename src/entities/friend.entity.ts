import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/entities/user.entity';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: User;

  @CreateDateColumn()
  createdAt: number;
}
