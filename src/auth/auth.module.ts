import { Module } from '@nestjs/common';
import { TokenController } from './token/token.controller';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LoginController } from './login/login.controller';
import { RegisterController } from './register/register.controller';
import { LoginStrategy } from './jwt/login.strategy';
import { PasswordResetController } from './passwordReset/passwordReset.controller';
import { PasswordResetRequestController } from './passwordReset/passwordResetRequest.controller';

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
  controllers: [TokenController, LoginController, RegisterController, PasswordResetController, PasswordResetRequestController],
  providers: [UserService, JwtStrategy, LoginStrategy]
})
export class AuthModule {}