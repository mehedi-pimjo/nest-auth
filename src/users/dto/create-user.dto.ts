import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email is too long' })
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Name is too long (max 100 characters)' })
  name?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(4, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password is too long' })
  password: string;
}