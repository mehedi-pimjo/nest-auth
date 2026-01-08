import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(user: JwtPayload, createData: CreateBlogDto) {
    const createdBlog = await this.prisma.blog.create({
      data: {
        title: createData.title,
        content: createData.content,
        authorId: user.sub,
      },
      include: {
        author: {
          omit: {
            password: true,
            role: true,
          },
        },
      },
    });

    return createdBlog;
  }

  async getAllBlogs() {
    const blogs = await this.prisma.blog.findMany();
    return blogs;
  }
}
