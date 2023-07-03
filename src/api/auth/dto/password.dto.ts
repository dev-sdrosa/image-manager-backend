import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsJWT, MinLength } from 'class-validator';

export abstract class PasswordsDto {

  @ApiProperty({
    description: 'New password',
    minLength: 8,
    maxLength: 35,
    type: String,
  })
  @IsString()
  @Length(8, 35)
  public password1!: string;

  @ApiProperty({
    description: 'Password confirmation',
    minLength: 1,
    type: String,
  })
  @IsString()
  @MinLength(1)
  public password2!: string;
}

export abstract class ResetPasswordDto extends PasswordsDto {

  @ApiProperty({
    description: 'The JWT token sent to the user email',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String,
  })
  @IsString()
  @IsJWT()
  public resetToken!: string;
}

export abstract class ChangePasswordDto extends PasswordsDto {

  @ApiProperty({
    description: 'New password confirmation',
    minLength: 1,
    type: String,
  })
  @IsString()
  @MinLength(1)
  public password!: string;
}