import { CreateUserDto } from './DTO/input/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      //  password: await bcrypt.hash(dto.password, 10),
    });
    try {
      await this.usersRepository.save(user);
      this.announceUserCreation(user);
      // build a verify URL (or token) locally since UserEntity doesn't expose verifyUrl
      const verifyUrl = `https://example.com/verify?userId=${user.id}`;
      await this.emailService.sendVerifyEmail(user.email, verifyUrl);
    } catch (error: unknown) {
      console.error('Error saving user:', error);
      if (error instanceof Error) throw error;
      throw new Error(String(error));
    }
    return user;
  }

  announceUserCreation(user: UserEntity): void {
    console.log(`User created: ${user.username}`);
  }
  async findOne(username: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async verifyEmail(userId: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (user.emailVerified) return user; // idempotent
    user.emailVerified = true;
    return this.usersRepository.save(user);
  }
}
