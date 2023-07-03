import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';
import { PasswordsDto } from './password.dto';

export abstract class SignInDto {
  
  @IsString()
  @Length(3, 255)
  public emailOrUsername: string;

  @IsString()
  @MinLength(1)
  public password: string;
}