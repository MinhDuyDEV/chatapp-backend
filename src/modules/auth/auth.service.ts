import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import {
  access_token_private_key,
  refresh_token_private_key,
} from 'src/private/jwt.constraint';
import { User } from '@/entities/user.entity';
import { compareText, hashText } from '@/shared/utils/auth-helpers';

import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { TokenPayload } from './types/token-payload.type';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto, res: Response): Promise<AuthResponse> {
    const existedUser = await this.userService.findUser({
      email: signupDto.email,
    });
    if (existedUser) throw new UnauthorizedException('User already exists');

    const user = await this.userService.createUser({
      ...signupDto,
      password: hashText(signupDto.password),
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);
    const userCookie = {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    };
    res.cookie('user', JSON.stringify(userCookie), {
      httpOnly: true,
      secure: true,
    });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return {
      user: userCookie,
    };
  }

  async login(user: User, res: Response): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.generateTokens(user);
    const userCookie = {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    };
    res.cookie('user', JSON.stringify(userCookie), {
      httpOnly: true,
      secure: true,
    });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return {
      user: userCookie,
    };
  }

  async refreshToken(user: User, res: Response): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.generateTokens(user);
    const userCookie = {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    };
    res.cookie('user', JSON.stringify(userCookie), {
      httpOnly: true,
      secure: true,
    });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return {
      user: userCookie,
    };
  }

  async logout(user: User, res: Response): Promise<void> {
    await this.userService.deleteRefreshToken(user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('user');
  }

  async getUserIfRefreshTokenMatched(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.userService.findUser({
      id: userId,
    });
    if (!user) throw new UnauthorizedException();
    if (!compareText(refreshToken, user.refreshToken))
      throw new UnauthorizedException();

    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const existedUser = await this.userService.findUser({
      email,
    });
    if (!existedUser)
      throw new UnauthorizedException('Invalid email or password');

    if (!existedUser || !compareText(password, existedUser.password))
      throw new UnauthorizedException('Invalid email or password');

    return existedUser;
  }

  async findUser(params: { id: string }): Promise<User> {
    return await this.userService.findUser({ id: params.id });
  }

  async generateTokens(user: User): Promise<any> {
    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = this.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    await this.userService.saveRefreshToken(hashText(refreshToken), user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRES_IN',
      )}s`,
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN',
      )}s`,
    });
  }
}
