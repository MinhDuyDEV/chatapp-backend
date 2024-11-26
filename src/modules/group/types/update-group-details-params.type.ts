export interface Attachment extends Express.Multer.File {}

export type UpdateGroupDetailsParams = {
  groupId: string;
  title?: string;
  avatar?: Attachment;
};
