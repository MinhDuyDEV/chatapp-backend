import { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { access_token_public_key } from 'src/private/jwt.constraint';

import { TokenPayload } from '../types/token-payload.type';
import { Services } from '@/shared/constants/services.enum';
import { IAuthService } from '@/modules/auth/auth';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH)
    private readonly authService: IAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: access_token_public_key,
    });
  }

  async validate(payload: TokenPayload) {
    return await this.authService.findUser({ id: payload.id });
  }
}
