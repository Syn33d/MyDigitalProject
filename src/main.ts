import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { RolesGuard } from './auth/security/roles.guard';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activation des extensions
  app.useGlobalPipes(new ValidationPipe());

  // Activation des guards
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173', // L'URL de votre application React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);

  // Ouverture du port 
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
