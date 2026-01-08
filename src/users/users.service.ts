import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class UsersService {
  private readonly saltRounds: number;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.saltRounds = Number(config.get<string>('SALT_ROUNDS')) || 12;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async getProfile(user: JwtPayload) {
    const data = await this.prisma.user.findUnique({
      where: { email: user.email },
      omit: {
        password: true,
      },
    });

    if (!data) {
      throw new UnauthorizedException();
    }

    return {
      user: data,
      message: 'Profile Fetched Successfully',
    };
  }

  async getAllProfiles() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async update(user: JwtPayload, id: number, updateData: UpdateUserDto) {
    if (user.role !== 'ADMIN' && user.sub !== id) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async adminUpdate(
    user: JwtPayload,
    id: number,
    updateData: AdminUpdateUserDto,
  ) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      message: 'User deleted successfully',
    };
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: {
        name: true,
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
