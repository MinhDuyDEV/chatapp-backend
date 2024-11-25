import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';

@Entity('files')
export class File extends BaseEntity {
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
