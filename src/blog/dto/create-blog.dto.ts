import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title is too long' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MaxLength(100_000, {
    message: 'Content is too long (max 100,000 characters)',
  })
  content: string;
}
