import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService {
  constructor (private config: ConfigService) {
    const url = this.config.getOrThrow<string>('DATABASE_URL');
  }
}
