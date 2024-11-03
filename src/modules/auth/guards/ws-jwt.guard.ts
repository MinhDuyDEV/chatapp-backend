import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { TokenPayload } from '@/modules/auth/types/token-payload.type';
import * as cookie from 'cookie';
import { AuthenticatedSocket } from '@/modules/events/types';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client: AuthenticatedSocket = context.switchToWs().getClient();

    try {
      await WsJwtGuard.validateToken(client, this.authService);
      return true;
    } catch (err) {
      Logger.error('Token validation failed', err);
      return false;
    }
  }

  static async validateToken(
    client: AuthenticatedSocket,
    authService: AuthService,
  ) {
    const cookies = client.handshake.headers.cookie;
    const parsedCookies = cookie.parse(cookies);
    const accessToken = parsedCookies['accessToken'];
    const payload: TokenPayload =
      await authService.verifyAccessToken(accessToken);
    client.user = await authService.findUser({ id: payload.id });
    return payload;
  }
}
