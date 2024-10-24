import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  lastName?: string;
}
