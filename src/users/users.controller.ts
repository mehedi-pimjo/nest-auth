import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Req() req: Request & { user?: any }) {
    return this.usersService.getProfile(req.user);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async update(
    @Req() req: Request & { user?: any },
    @Param('id') id: number,
    @Body() updateData: UpdateUserDto,
  ) {
    return await this.usersService.update(req.user, id, updateData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
