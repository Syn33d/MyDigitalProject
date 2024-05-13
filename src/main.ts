import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activation des extensions
  app.useGlobalPipes(new ValidationPipe());

  // Ouverture du port 
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
