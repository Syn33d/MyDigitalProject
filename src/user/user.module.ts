import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [UserController],
  providers: [UserService, StripeService],
})
export class UserModule {}
