import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from '@/modules/users/users.service';
import { User } from '@/domain/user.entity';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt'
) {
  constructor(
    private userService: UsersService,
    private readonly configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const { headers, signedCookies } = req;
          // get refresh token from refresh-token cookie
          const refreshTokenFromCookie =
            signedCookies && signedCookies['refresh-token'];

          // get refresh token from refresh-token header
          const refreshTokenFromHeader = headers['refresh-token'] as string;

          // get refresh token from authorization bearer header
          const { authorization } = headers;
          const refreshTokenFromBearer = authorization?.split(' ')[1];

          const token =
            refreshTokenFromCookie ||
            refreshTokenFromHeader ||
            refreshTokenFromBearer;

          return token;
        },
      ]),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user: User = await this.userService.findById(id);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    return user;
  }
}
