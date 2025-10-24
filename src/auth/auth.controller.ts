import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/Users/DTO/input/create-user.dto';
import { AuthGuard } from './auth.guard';
import { EmailService } from 'src/email/email.service';

interface RequestWithUser extends ExpressRequest {
  user?: { [key: string]: unknown };
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: CreateUserDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    console.log('on passe dans getProfile avec user :', req.user);
    return req.user;
  }

  @Get('test-email')
  async sendTest() {
    await this.emailService.sendVerifyEmail(
      'test@example.com',
      'http://localhost:3000/auth/verify?token=dummy',
    );
    return 'Mail envoyé (check Mailtrap)';
  }
}
