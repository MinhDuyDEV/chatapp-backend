import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  IsDateString,
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
  @Length(1, 50)
  username: string;

  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsDateString()
  birthday: string;

  @IsString()
  gender: string;
}
