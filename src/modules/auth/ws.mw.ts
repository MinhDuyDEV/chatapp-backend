import { Socket } from 'socket.io';
import { WsJwtGuard } from '@/modules/auth/guards/ws-jwt.guard';
import { AuthenticatedSocket } from '@/modules/events/types';
import { IAuthService } from '@/modules/auth/auth';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: any) => void): void;
};

export const SocketAuthMiddleware = (
  authService: IAuthService,
): SocketIOMiddleware => {
  return async (client: AuthenticatedSocket, next) => {
    try {
      await WsJwtGuard.validateToken(client, authService);
      next();
    } catch (err) {
      next(err);
    }
  };
};
