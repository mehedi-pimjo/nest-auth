import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Req() req: Request & { user?: any },
    @Body() createData: CreateBlogDto,
  ) {
    return {
      blog: await this.blogService.create(req.user, createData),
      message: 'Blog Created Successfully',
    };
  }

  @Get()
  async getAllBlogs() {
    return {
      blogs: await this.blogService.getAllBlogs(),
      message: 'Blogs retrieved Successfully',
    };
  }
}
