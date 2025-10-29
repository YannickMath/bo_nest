import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one number',
  })
  password: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user', 'guest'])
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
