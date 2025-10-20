import { User } from '../interfaces/users.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  create(user: User) {
    // this.users.push(user);
    return user;
  }

  announceUserCreation(user: User): void {
    console.log(`User created: ${user.username}`);
  }
}
