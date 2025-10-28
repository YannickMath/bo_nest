import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/Users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/Users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private cfg: ConfigService,
  ) {}

  async signIn(mail: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(mail);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please verify your email and try again.',
      );
    }
    const payload = { sub: user.id, username: user.username };
    // toggle active flag on the user and persist the change
    user.isActive = !user.isActive;
    await this.usersRepository.save(user);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  signEmailToken(user: { id: number; email: string }) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.cfg.get<string>('JWT_EMAIL_SECRET')!,
        expiresIn: this.cfg.get('JWT_EMAIL_EXPIRES') ?? '30m',
      },
    );
  }

  verifyEmailToken(token: string): { sub: number; email: string } {
    return this.jwtService.verify(token, {
      secret: this.cfg.get<string>('JWT_EMAIL_SECRET')!,
    });
  }
}
