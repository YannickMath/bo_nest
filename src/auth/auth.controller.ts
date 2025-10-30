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
  Req,
  Res,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/Users/users.service';
import { LoginUserDto } from 'src/Users/DTO/input/login-user.dto';
import { generateCsrfToken } from 'src/cookies/csrf.module';
import type { Response } from 'express';
import crypto from 'crypto';

// à patcher plus tard
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
  async signIn(
    @Body() signInDto: LoginUserDto,
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenObj = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    // Rotate l'identifiant de session CSRF
    const newId = crypto.randomBytes(32).toString('hex');

    // Écrit le cookie côté **réponse** -> envoyé au navigateur
    res.cookie('CSRF_SESSION_ID', newId, {
      httpOnly: true, // Protège contre JS injection
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    req.cookies = req.cookies || {};

    // S'assure que le cookie XSRF-TOKEN existe (sinon generateCsrfToken peut échouer)
    req.cookies['XSRF-TOKEN'] ??= '';

    const csrfToken = generateCsrfToken(req, res);

    return { ...tokenObj, csrfToken };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
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
    };
  }
}
