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

  @Post('announceNewCsrfToken')
  announceNewCsrfToken() {
    return 'This action announces a new CSRF token';
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return `This action returns user #${id}`;
  }

  @Get()
  findAll() {
    return 'This action returns all users';
  }
}
