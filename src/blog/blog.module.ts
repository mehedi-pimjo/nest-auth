import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [BlogService, JwtService],
  controllers: [BlogController],
})
export class BlogModule {}
