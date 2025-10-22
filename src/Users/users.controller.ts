import { CreateUserDto } from './DTO/input/create-user.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return `This action returns user #${id}`;
  }

  @Get('announce')
  // announceUserCreation() {
  //   const sampleUser = {
  //     id: 1,
  //     username: 'john_doe',
  //     email: 'john@example.com',
  //     password: 'securepassword',
  //     role: 'user',
  //     isActive: true,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };
  //   this.usersService.announceUserCreation(sampleUser);
  //   console.log(`User created: ${sampleUser.username}`);
  //   return 'User creation announced';
  // }
  @Get()
  findAll() {
    return 'This action returns all users';
  }
}
