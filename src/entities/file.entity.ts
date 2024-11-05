import { Column, Entity, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { BaseEntity } from './base.entity';
import { FileType } from '@/shared/constants/file-type';

@Entity()
export class File extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.file, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  post: Post | null;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  type: FileType;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column()
  key: string;
}
