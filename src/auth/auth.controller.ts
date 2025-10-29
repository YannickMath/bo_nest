import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Query,
  NotFoundException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/Users/users.service';
import { LoginUserDto } from 'src/Users/DTO/input/login-user.dto';

interface RequestWithUser extends ExpressRequest {
  user?: { [key: string]: unknown };
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginUserDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    console.log('on passe dans getProfile avec user :', req.user);
    return req.user;
  }
  @Get('verify')
  @HttpCode(200)
  async verify(@Query('token') token: string) {
    const payload = this.authService.verifyEmailToken(token);
    const user = await this.usersService.findOneById(payload.sub); // <-- bascule à true (idempotent)

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.updateEmailVerified(user.id, true);

    return {
      message: 'Email vérifié. Tu peux te connecter.',
      user: { id: user.id, email: user.email, emailVerified: true },
      // tokens: { accessToken, refreshToken },
      //save email
    };
  }
}
