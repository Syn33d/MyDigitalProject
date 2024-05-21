import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { RolesGuard } from './auth/security/roles.guard';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as bodyParser from 'body-parser';


config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activation des extensions
  app.useGlobalPipes(new ValidationPipe());

  const corsOptions: CorsOptions = {
    origin: '*', // L'URL de votre application React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);

  // Ouverture du port 
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
