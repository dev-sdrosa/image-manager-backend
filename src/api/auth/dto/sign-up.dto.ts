import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { PasswordsDto } from './password.dto';
import { ApiProperty } from '@nestjs/swagger';

export abstract class SignUpDto extends PasswordsDto {

  @ApiProperty({
    description: 'The user name',
    minLength: 3,
    maxLength: 100,
    type: String,
  })
  @IsString()
  @Length(3, 100, {
    message: 'Name has to be between 3 and 50 characters.',
  })
  public name!: string;

  @ApiProperty({
    description: 'The username',
    minLength: 3,
    maxLength: 100,
    type: String,
  })
  @IsString()
  @Length(3, 100, {
    message: 'Username has to be between 3 and 50 characters.',
  })
  public username!: string;

  @ApiProperty({
    description: 'The user email',
    example: 'example@gmail.com',
    minLength: 5,
    maxLength: 255,
    type: String,
  })
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email!: string;

  
}