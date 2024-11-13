import { SignupDto } from '@/modules/auth/dto/signup.dto';
import { Response } from 'express';
import { AuthResponse } from '@/modules/auth/types/auth-response.type';
import { User } from '@/entities/user.entity';
import { TokenPayload } from '@/modules/auth/types/token-payload.type';

export interface IAuthService {
  signup(signupDto: SignupDto, res: Response): Promise<AuthResponse>;
  login(user: User, res: Response): Promise<AuthResponse>;
  refreshToken(user: User, res: Response): Promise<AuthResponse>;
  logout(user: User, res: Response): Promise<void>;
  validateUser(email: string, password: string): Promise<User>;
  findUser(params: { id: string }): Promise<User>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  getUserIfRefreshTokenMatched(
    userId: string,
    refreshToken: string,
  ): Promise<User>;
}
