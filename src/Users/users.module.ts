import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { AuthModule } from 'src/auth/auth.module';
import { CsrfController } from 'src/cookies/csrf.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, CsrfController],
  providers: [UsersService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}
