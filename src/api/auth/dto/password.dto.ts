import { IsString, Length, IsJWT, MinLength } from 'class-validator';

export abstract class PasswordsDto {
    @IsString()
    @Length(8, 35)
    public password1!: string;

    @IsString()
    @MinLength(1)
    public password2!: string;
}

export abstract class ResetPasswordDto extends PasswordsDto {
  @IsString()
  @IsJWT()
  public resetToken!: string;
}

export abstract class ChangePasswordDto extends PasswordsDto {
  @IsString()
  @MinLength(1)
  public password!: string;
}