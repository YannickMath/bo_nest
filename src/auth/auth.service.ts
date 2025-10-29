import {
  ForbiddenException,
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
import * as bcrypt from 'bcrypt';

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

    if (!user?.emailVerified) {
      throw new ForbiddenException(
        'Email not verified. Please verify your email and try again.',
      );
    }

    const ok = await bcrypt.compare(pass, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) {
      user.isActive = true;
      await this.usersRepository.save(user);
    }

    user.lastLoginAt = new Date();

    const payload = { sub: user.id, username: user.username };

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
