import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isJWT } from 'class-validator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtService } from 'src/api/jwt/providers/jwt.service';
import { TokenTypeEnum } from 'src/common/enums/token.enum';
import { Request } from 'express-serve-static-core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const activate = await this.setHttpHeader(
            context.switchToHttp().getRequest(),
            isPublic,
        );

        if (!activate) {
            throw new UnauthorizedException();
        }

        return activate;
    }

    private async setHttpHeader(
        req: Request,
        isPublic: boolean,
    ): Promise<boolean> {
        const auth = req.headers?.authorization;

        if (!auth || auth.length === 0) {
            return isPublic;
        }

        const authArr = auth.split(' ');
        const bearer = authArr[0];
        const token = authArr[1];

        if (!bearer || bearer !== 'Bearer') {
            return isPublic;
        }
        if (!token) {
            return isPublic;
        }

        try {
            const { id } = await this.jwtService.verifyToken(
                token,
                TokenTypeEnum.ACCESS,
            );
            req.user = id;
            return true;
        } catch (_) {
            return isPublic;
        }
    }
}