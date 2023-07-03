import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from 'src/api/jwt/providers/jwt.service';
import { MailerService } from 'src/api/mailer/providers/mailer.service';
import { UserService } from 'src/api/user/providers/user.service';
import { CommonService } from 'src/common/providers/common.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { IMessage } from 'src/common/interfaces/message.interface';
import { TokenTypeEnum } from 'src/common/enums/token.enum';
import { User } from 'src/api/user/entities/user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { IAuthResult } from '../dto/auth.dto';
import { IRefreshToken } from 'src/common/interfaces/token/refresh-token.interface';
import { EmailDto } from '../dto/email.dto';
import { ChangePasswordDto, ResetPasswordDto } from '../dto/password.dto';
import { IEmailToken } from 'src/common/interfaces/email/email-token';
import { ConfirmEmailDto } from '../dto/confirm-email.tdo';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  public async signUp(dto: SignUpDto, domain?: string): Promise<IMessage> {
    const { name, email, username, password1, password2 } = dto;

    this.comparePasswords(password1, password2);

    const user: any = await this.userService.new(email, name, password1);
    const confirmationToken = await this.jwtService.generateToken(
      user,
      TokenTypeEnum.CONFIRMATION,
      domain,
    );
    this.mailerService.sendConfirmationEmail(user, confirmationToken);
    return this.commonService.generateMessage('Registration successful! Confirm your email');
  }

  public async signIn(dto: SignInDto, domain?: string): Promise<IAuthResult> {
    const { emailOrUsername, password } = dto;
    const user = await this.userByEmailOrUsername(emailOrUsername);

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.confirmed) {
      const confirmationToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.CONFIRMATION,
        domain,
      );
      this.mailerService.sendConfirmationEmail(user, confirmationToken);
      throw new UnauthorizedException(
        'Please confirm your email, a new email has been sent',
      );
    }

    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain,
    );
    return { user, accessToken, refreshToken };
  }

  public async refreshTokenAccess(
    refreshToken: string,
    domain?: string,
  ): Promise<IAuthResult> {
    const { id, tokenId } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
    const user = await this.userService.findById(id);
    const [accessToken, newRefreshToken] = await this.generateAuthTokens(
      user,
      domain,
      tokenId,
    );
    return { user, accessToken, refreshToken: newRefreshToken };
  }

  // Refac enpoint storing refreshTokens on Redis
  public async logout(refreshToken: string): Promise<IMessage> {
    const token = await this.jwtService.verifyToken<IRefreshToken>(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );
    return this.commonService.generateMessage('Logout successful');
  }

  public async resetPasswordEmail(
    dto: EmailDto,
    domain?: string,
  ): Promise<IMessage> {
    const user = await this.userService.uncheckedUserByEmail(dto.email);

    if (user) {
      const resetToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.RESET_PASSWORD,
        domain,
      );
      this.mailerService.sendResetPasswordEmail(user, resetToken);
    }

    return this.commonService.generateMessage('Reset password email sent');
  }

  public async resetPassword(dto: ResetPasswordDto): Promise<IMessage> {
    const { password1, password2, resetToken } = dto;
    const { id, version } = await this.jwtService.verifyToken<IEmailToken>(
      resetToken,
      TokenTypeEnum.RESET_PASSWORD,
    );
    this.comparePasswords(password1, password2);
    await this.userService.resetPassword(id, version, password1);
    return this.commonService.generateMessage('Password reset successful');
  }

  public async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<IAuthResult> {
    const { password1, password2, password } = dto;
    this.comparePasswords(password1, password2);
    const user = await this.userService.updatePassword(
      userId,
      password,
      password1,
    );
    const [accessToken, refreshToken] = await this.generateAuthTokens(user);
    return { user, accessToken, refreshToken };
  }

  private comparePasswords(password1: string, password2: string): void {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  public async userByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User> {
    if (emailOrUsername.includes('@')) {
      if (!emailOrUsername) {
        throw new BadRequestException('Invalid email');
      }
      console.log(1)
      return this.userService.findOneByEmail(emailOrUsername);
    }

    if (
       emailOrUsername.length < 3 ||
       emailOrUsername.length > 106 
     ) {
      throw new BadRequestException('Invalid username');
    }
    console.log(2)
    return this.userService.findOneByUsername(emailOrUsername, true);
  }

  private async generateAuthTokens(
    user: User,
    domain?: string,
    tokenId?: string,
  ): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.ACCESS,
        domain,
        tokenId,
      ),
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.REFRESH,
        domain,
        tokenId,
      ),
    ]);
  }

  public async confirmEmail(
    dto: ConfirmEmailDto,
    domain?: string,
  ): Promise<IAuthResult> {
    const { confirmationToken } = dto;
    const { id, version } = await this.jwtService.verifyToken<IEmailToken>(
      confirmationToken,
      TokenTypeEnum.CONFIRMATION,
    );
    const user = await this.userService.confirmEmail(id, version);
    const [accessToken, refreshToken] =
      await this.jwtService.generateAuthTokens(user, domain);
    return { user, accessToken, refreshToken };
  }
}