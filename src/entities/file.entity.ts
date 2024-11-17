import { Column, Entity, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { BaseEntity } from './base.entity';
import { FileType } from '@/shared/constants/file-type';
import { Exclude } from 'class-transformer';

@Entity()
export class File extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.files, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  @Exclude()
  type: FileType;

  @Column()
  mimetype: string;

  @Column()
  url: string;

  @Column()
  @Exclude()
  name: string;

  @Column()
  @Exclude()
  key: string;
}
