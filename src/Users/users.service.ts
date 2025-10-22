import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './DTO/input/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
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
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
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
}
