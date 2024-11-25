import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  attachments?: AttachmentDto[];
}

export class AttachmentDto {
  @IsString()
  id: string;

  @IsString()
  url: string;

  @IsString()
  mimetype: string;

  @IsOptional()
  @IsString()
  name?: string;
}
