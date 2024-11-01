import { Expose } from 'class-transformer';

export class LastMessageSentResponse {
  @Expose()
  content: string;

  @Expose()
  createdAt: Date;
}
