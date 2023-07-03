import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { PasswordsDto } from './password.dto';

export abstract class SignUpDto extends PasswordsDto {
  @IsString()
  @Length(3, 100, {
    message: 'Name has to be between 3 and 50 characters.',
  })
  public name!: string;

  @IsString()
  @Length(3, 100, {
    message: 'Username has to be between 3 and 50 characters.',
  })
  public username!: string;

  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email!: string;

  
}