import { Expose } from 'class-transformer';

export class BaseFileResponseDto {
  @Expose()
  id: string;

  @Expose()
  url: string;

  @Expose()
  mimetype: string;
}
