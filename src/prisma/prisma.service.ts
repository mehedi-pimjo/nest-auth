import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor (private config: ConfigService) {
    const url = this.config.getOrThrow<string>('DATABASE_URL');
  }
}
