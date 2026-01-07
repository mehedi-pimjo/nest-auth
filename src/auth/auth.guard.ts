import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(type, token);
    return type === 'Bearer' ? token : undefined;
  }

  private async validateRequest(request: Request): Promise<boolean> {
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    console.log(`accessToken ${accessToken}`);

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: 'verysecretkey',
      });
      request['user'] = payload;
    } catch (error) {
      console.log('JWT verification failed:', {
        name: error.name,
        message: error.message,
        expiredAt: error.expiredAt, // only on TokenExpiredError
        // stack: error.stack              // optional – can be noisy
      });
      throw new UnauthorizedException();
    }

    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }
}
