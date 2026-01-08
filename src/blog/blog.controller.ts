import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
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

  @UseGuards(AuthGuard)
  @Get('my')
  async getMyBlogs(@Req() req: Request & { user?: any }) {
    console.log(req.user);
    return {
      blogs: await this.blogService.getMyBlogs(req.user),
      message: 'Blogs retrieved Successfully',
    };
  }

  @Get(':id')
  async getBlog(@Param('id') id: string) {
    return {
      blog: await this.blogService.getBlog(+id),
      message: 'Blog retrieved Successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request & { user?: any }, @Param('id') id: string) {
    return {
      blog: await this.blogService.remove(req.user, +id),
      message: 'Blog removed successfully',
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Delete()
  async removeAll() {
    return {
      blogs: await this.blogService.removeAll(),
      message: 'Blogs removed successfully',
    };
  }
}
