export interface Attachment extends Express.Multer.File {}

export type UpdateGroupDetailsParams = {
  id: number;
  title?: string;
  avatar?: Attachment;
};
