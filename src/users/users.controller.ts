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
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request & { user?: any }) {
    return await this.usersService.getProfile(req.user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Get()
  async getAllProfiles() {
    return {
      users: await this.usersService.getAllProfiles(),
      message: 'Users retrieved Successfully',
    };
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
  @Patch('update/:id/admin')
  async adminUpdate(
    @Req() req: Request & { user?: any },
    @Param('id') id: number,
    @Body() updateData: AdminUpdateUserDto,
  ) {
    return {
      user: await this.usersService.adminUpdate(req.user, id, updateData),
      message: 'User Updated Successfully',
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
