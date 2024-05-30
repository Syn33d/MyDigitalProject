import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import Stripe from 'stripe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MagazineService } from '../magazine/magazine.service';
import { Magazine } from '../magazine/entities/magazine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Magazine])],
  controllers: [StripeController],
  providers: [StripeService, MagazineService],
})
export class StripeModule {}
