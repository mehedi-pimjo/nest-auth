/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    const { password, ...userWithoutPassword } = createdUser;

    const payload = {
      sub: userWithoutPassword.id,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    return {
      user: userWithoutPassword,
      token,
      message: 'Signed up Successfully',
    };
  }

  // async signIn(email: string, pass: string): Promise<{ token: string }> {
  //   const user = await this.usersService.findOne(email);
  //   if (user?.password !== pass) {
  //     throw new UnauthorizedException();
  //   }

  //   const payload = { sub: user.id, email: user.email };
  //   return {
  //     token: await this.jwtService.signAsync(payload),
  //   };
  // }
}
