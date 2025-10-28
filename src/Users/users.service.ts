import { CreateUserDto } from './DTO/input/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private emailService: EmailService,
    private authService: AuthService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });
    await this.usersRepository.save(user);

    // Génère un token de vérif et un lien vers le backend
    const token = this.authService.signEmailToken({
      id: user.id,
      email: user.email,
    });
    const apiBase = process.env.APP_BASE_URL;
    const verifyUrl = `${apiBase}/auth/verify?token=${encodeURIComponent(token)}`;

    await this.emailService.sendVerifyEmail(user.email, verifyUrl);
    return user;
  }

  findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findOneById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  updateEmailVerified(userId: number, verified: boolean): Promise<void> {
    return this.usersRepository
      .update({ id: userId }, { emailVerified: verified })
      .then(() => {});
  }
}
