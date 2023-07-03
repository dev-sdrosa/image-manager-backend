import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, ValidateIf, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
    name: string;
    username: string;
    email: string
    password: string
}


export abstract class UpdateUserDto {

  @ApiProperty({
    description: 'The username of the user',
    minLength: 3,
    maxLength: 106,
    example: 'my-username',
    type: String,
  })
  @IsString()
  @Length(3, 106)
  @ValidateIf(
    (o: UpdateUserDto) =>
      !o.username || !o.name || !o.name,
  )
  public username?: string;

  @ApiProperty({
    description: 'The name of the user',
    minLength: 3,
    maxLength: 100,
    example: 'my-name',
    type: String,
  })
  @IsString()
  @Length(3, 100)
 
  @ValidateIf(
    (o: UpdateUserDto) =>
      !o.name || !o.username || !o.username,
  )
  public name?: string;
}



export abstract class ChangeEmailDto {
  @IsString()
  @MinLength(1)
  public password!: string;

  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email: string;
}

export abstract class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  public password!: string;

  @IsString()
  @MinLength(1)
  public newPassword: string;
}