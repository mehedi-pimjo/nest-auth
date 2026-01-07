import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
}
