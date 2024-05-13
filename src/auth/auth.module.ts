import { Module } from '@nestjs/common';
import { TokenController } from './token/token.controller';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "banane",
      signOptions: {
        audience: process.env.JWT_AUDIENCE || "dar.com"
      }
    })
  ],
  controllers: [TokenController],
  providers: [UserService, JwtStrategy]
})
export class AuthModule { }