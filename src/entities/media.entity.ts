import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.media, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  post: Post | null;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;
}
