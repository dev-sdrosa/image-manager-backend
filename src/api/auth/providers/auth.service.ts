import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from 'src/api/jwt/providers/jwt.service';
import { MailerService } from 'src/api/mailer/providers/mailer.service';
import { User } from 'src/api/user/entities/user.entity';
import { UserService } from 'src/api/user/providers/user.service';
import { TokenTypeEnum } from 'src/common/enums/token.enum';
import { CommonService } from 'src/common/providers/common.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { IMessage } from 'src/common/interfaces/message.interface';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  public async generateAuthTokens(
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

  public comparePasswords(password1: string, password2: string): void {
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

      return this.userService.findByEmail(emailOrUsername);
    }

    if (
       emailOrUsername.length < 3 ||
       emailOrUsername.length > 106 
     ) {
      throw new BadRequestException('Invalid username');
    }

    return this.userService.findByUsername(emailOrUsername);
  }


}