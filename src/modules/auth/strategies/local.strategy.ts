import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

import { Inject, Injectable } from '@nestjs/common';
import { Services } from '@/shared/constants/services.enum';
import { IAuthService } from '@/modules/auth/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH)
    private readonly authService: IAuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return await this.authService.validateUser(email, password);
  }
}
