import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // ← required! converts plain object → DTO class instance
      whitelist: true, // ← strips unknown fields
      forbidNonWhitelisted: true, // ← throws error if unknown fields present
      forbidUnknownValues: true, // ← even stricter
      skipMissingProperties: false, // ← do NOT skip validation on missing/undefined fields
      validationError: { target: false }, // optional: cleaner error output
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
