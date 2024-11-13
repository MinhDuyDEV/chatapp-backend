import { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { refresh_token_public_key } from 'src/private/jwt.constraint';
import { TokenPayload } from '../types/token-payload.type';
import { Services } from '@/shared/constants/services.enum';
import { IAuthService } from '@/modules/auth/auth';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    @Inject(Services.AUTH)
    private readonly authService: IAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refresh_token_public_key,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.refreshToken;
    return await this.authService.getUserIfRefreshTokenMatched(
      payload.id,
      refreshToken,
    );
  }
}
