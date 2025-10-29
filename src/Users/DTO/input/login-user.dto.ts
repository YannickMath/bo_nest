import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one number',
  })
  password: string;

  @IsEmail()
  email: string;
}
