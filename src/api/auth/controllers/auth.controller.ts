import { Controller, Get, Post, Put, Delete, Param, Body, ConflictException, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { CommonService } from 'src/common/providers/common.service';
import { UserService } from 'src/api/user/providers/user.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { IMessage } from 'src/common/interfaces/message.interface';
import { JwtService } from 'src/api/jwt/providers/jwt.service';
import { AuthService } from '../providers/auth.service';
import { TokenTypeEnum } from 'src/common/enums/token.enum';
import { MailerService } from 'src/api/mailer/providers/mailer.service';
import { IAuthResult } from '../dto/auth.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { IRefreshToken } from 'src/common/interfaces/token/refresh-token.interface';
import { EmailDto } from '../dto/email.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express-serve-static-core';

@Controller('auth')
export class AuthController {
    private readonly cookiePath = '/api/auth';
    private readonly cookieName: string;
    private readonly refreshTime: number;
    private readonly testing: boolean;

    constructor(
        private readonly userService: UserService,
        private readonly commonService: CommonService,
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {
        this.cookieName = this.configService.get<string>('REFRESH_COOKIE');
        this.refreshTime = this.configService.get<number>('jwt.refresh.time');
        this.testing = this.configService.get<string>('NODE_ENV') !== 'production';
    }

    private refreshTokenFromReq(req: Request): string {
        const token: string | undefined = req.signedCookies[this.cookieName];

        if (!token) {
            throw new UnauthorizedException();
        }

        return token;
    }

    private saveRefreshCookie(res: Response, refreshToken: string): Response {
        return res.cookie(this.cookieName, refreshToken, {
          secure: !this.testing,
          httpOnly: true,
          signed: true,
          path: this.cookiePath,
          expires: new Date(Date.now() + this.refreshTime * 1000),
        });
      }
    

    @Post("signup")
    public async signUp(
        @Body() dto: SignUpDto,
        @Param() domain?: string
    ): Promise<IMessage> {
        const { name, email, username, password1, password2 } = dto;
        const user = await this.userService.findByEmail(email);

        if (user) {
            throw new ConflictException('Email already in use');
        }

        this.authService.comparePasswords(password1, password2);
        await this.userService.create({
            name: name,
            email: email,
            username: username,
            password: await hash(password1, 10),
        });
        const confirmationToken = await this.jwtService.generateToken(
            user,
            TokenTypeEnum.CONFIRMATION,
            domain,
        );
        this.mailerService.sendConfirmationEmail(user, confirmationToken);
        return this.commonService.generateMessage('Registration successful! Check your confirmation email');
    }

    @Post("signin")
    public async singIn(
        @Body() dto: SignInDto,
        @Param() domain?: string
    ): Promise<IAuthResult> {
        const { emailOrUsername, password } = dto;
        const user = await this.authService.userByEmailOrUsername(emailOrUsername);

        if (!(await compare(password, user.password))) {
            throw new BadRequestException('Invalid password')
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

        const [accessToken, refreshToken] = await this.authService.generateAuthTokens(
            user,
            domain,
        );
        return { user, accessToken, refreshToken };
    }

    @Post("refresh-token")
    public async refreshTokenAccess(
        @Param() refreshToken: string,
        @Param() domain?: string,
    ): Promise<IAuthResult> {
        const { id, version, tokenId } =
            await this.jwtService.verifyToken<IRefreshToken>(
                refreshToken,
                TokenTypeEnum.REFRESH,
            );
        const user = await this.userService.findById(id);
        const [accessToken, newRefreshToken] = await this.authService.generateAuthTokens(
            user,
            domain,
            tokenId,
        );
        return { user, accessToken, refreshToken: newRefreshToken };
    }

    // public async logout(refreshToken: string): Promise<IMessage> {
    // Store refreshToken on Redis and remove it
    // }

    @Post("reset-password")
    public async resetPasswordEmail(
        @Body() dto: EmailDto,
        @Param() domain?: string,
    ): Promise<IMessage> {
        const user = await this.userService.uncheckedUserByEmail(dto.email);

        if (!user) {
            const resetToken = await this.jwtService.generateToken(
                user,
                TokenTypeEnum.RESET_PASSWORD,
                domain,
            );
            this.mailerService.sendResetPasswordEmail(user, resetToken);
        }

        return this.commonService.generateMessage('Reset password email sent');
    }

}