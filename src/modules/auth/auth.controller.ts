import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { User } from '@/entities/user.entity';
import { ROUTES } from '@/shared/constants/routes.enum';
import { Public } from '@/shared/decorators/public.decorator';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { AuthenticatedRequest } from '@/shared/types/authenticated-request.type';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';

@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    return res
      .status(HttpStatus.CREATED)
      .send(await this.authService.signup(signupDto, res));
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: AuthenticatedRequest, @Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .send(await this.authService.login(request.user, res));
  }

  @Public()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refresh(@AuthUser() user: User, @Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .send(await this.authService.refreshToken(user, res));
  }

  @Get('profile')
  async me(@AuthUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('logout')
  async logout(@AuthUser() user: User, @Res() res: Response) {
    res
      .status(HttpStatus.NO_CONTENT)
      .send(await this.authService.logout(user, res));
  }
}
