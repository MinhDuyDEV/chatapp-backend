import { ArrayNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString({ each: true })
  @ArrayNotEmpty()
  users: string[];

  @IsOptional()
  title: string;
}
