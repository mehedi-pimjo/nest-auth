import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/common/types/jwt-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

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

  async getBlog(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });

    return blog;
  }

  async getMyBlogs(user: JwtPayload) {
    const blogs = await this.prisma.blog.findMany({
      where: {
        authorId: user.sub,
      },
    });

    return blogs;
  }

  async update(user: JwtPayload, id: number, updateData: UpdateBlogDto) {
    if (user.role != 'ADMIN' && user.sub != id) {
      throw new UnauthorizedException('You can only update your blogs');
    }

    const updatedBlog = await this.prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return updatedBlog;
  }

  async remove(user: JwtPayload, id: number) {
    if (user.role != 'ADMIN' && user.sub != id) {
      throw new UnauthorizedException('You can only remove your blogs');
    }

    const deletedBlog = await this.prisma.blog.delete({
      where: { id },
    });

    return deletedBlog;
  }

  async removeAll() {
    const deletedBlogs = await this.prisma.blog.deleteMany();

    return deletedBlogs;
  }
}
