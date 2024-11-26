import { Attachment } from '@/modules/group/types/update-group-details-params.type';
import * as sharp from 'sharp';

export const compressImage = (attachment: Attachment) =>
  sharp(attachment.buffer).resize(300).jpeg().toBuffer();
