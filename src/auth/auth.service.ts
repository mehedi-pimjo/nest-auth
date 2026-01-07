/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

interface TokenPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async createAccessToken(payload: TokenPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    return accessToken;
  }

  async signUp(createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    const { password, ...userWithoutPassword } = createdUser;

    const payload = {
      sub: userWithoutPassword.id,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
    };

    const accessToken = await this.createAccessToken(payload);

    return {
      user: userWithoutPassword,
      accessToken,
      message: 'Signed up Successfully',
    };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.createAccessToken(payload);

    return {
      user,
      accessToken,
      message: 'Sign in Successful',
    };
  }
}
