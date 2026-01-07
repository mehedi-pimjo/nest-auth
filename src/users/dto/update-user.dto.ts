import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsOptional()
  @MaxLength(255, { message: 'Email is too long' })
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Name is too long (max 100 characters)' })
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @MaxLength(128, { message: 'Password is too long' })
  password?: string;
}