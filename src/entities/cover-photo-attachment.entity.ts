import { Entity, OneToOne } from 'typeorm';
import { File } from './file.entity';
import { Profile } from './profile.entity';

@Entity('cover_photo_attachments')
export class CoverPhotoAttachment extends File {
  @OneToOne(() => Profile, (profile) => profile.coverPhoto, {
    onDelete: 'CASCADE',
  })
  profile: Profile;
}
