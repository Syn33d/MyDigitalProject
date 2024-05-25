import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MagazineService } from '../magazine/magazine.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService,
    private readonly magazineService: MagazineService,
    @InjectRepository(User) private data: Repository<User>


  ) { }

  @Post('create-customer')
  async createCustomer(email: string, paymentMethod: string) {
    // Recherchez un utilisateur avec l'adresse e-mail donnée
    const user = await this.data.findOneBy({ email });

    // Si un utilisateur est trouvé et qu'il a déjà un stripeCustomerId, alors un client existe déjà
    if (user && user.stripeCustomerId) {
      throw new Error('A customer already exists for this email address');
    }

    // Si aucun utilisateur n'est trouvé ou si l'utilisateur trouvé n'a pas de stripeCustomerId, créez un nouveau client
    const customer = await this.stripeService.createCustomer(email, paymentMethod);

    // Si un utilisateur a été trouvé, mettez à jour son stripeCustomerId
    if (user) {
      user.stripeCustomerId = customer.id;
      await this.data.save(user);
    }
    // Si aucun utilisateur n'a été trouvé, vous pouvez choisir de créer un nouvel utilisateur ici si vous le souhaitez

    return customer;
  }

  @Delete('delete-customer')
  async deleteCustomer(@Body('customerId') customerId: string) {
    return this.stripeService.deleteCustomer(customerId);
  }

  @Post('create-subscription')
  async createSubscription(
    @Body('idUser') idUser: string,
    @Body('priceId') priceId: string,
  ) {
    const user = await this.data.findOneById(idUser);
    if (!user || !user.stripeCustomerId) {
      throw new Error('User not found or Stripe customer ID not available');
    }
    return this.stripeService.createSubscription(user.stripeCustomerId, priceId);
  }

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body('amount') amount: number,
    @Body('currency') currency: string,
  ) {
    return this.stripeService.createPaymentIntent(amount, currency);
  }

  @Post('cancel-subscription')
  async cancelSubscription(@Body('subscriptionId') subscriptionId: string) {
    return this.stripeService.cancelSubscription(subscriptionId);
  }

  @Post('update-subscription')
  async updateSubscription(
    @Body('subscriptionId') subscriptionId: string,
    @Body('data') data: Stripe.SubscriptionUpdateParams,
  ) {
    return this.stripeService.updateSubscription(subscriptionId, data);
  }

  @Post('retrieve-subscription')
  async retrieveSubscription(@Body('subscriptionId') subscriptionId: string) {
    return this.stripeService.retrieveSubscription(subscriptionId);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('userId') userId: number,
    @Body('priceId') priceId: string,
    @Body('paymentMethod') paymentMethod: string,
    @Body('successUrl') successUrl: string,
    @Body('cancelUrl') cancelUrl: string,
  ) {
    const user = await this.data.findOneById(userId);
    if (!user || !user.stripeCustomerId) {
      throw new Error('User not found or Stripe customer ID not available');
    }
    return this.stripeService.createCheckoutSession(user.stripeCustomerId, priceId, successUrl, cancelUrl, paymentMethod);
  }

  @Post('subscribe')
  async subscribe(@Body() body: { email: string, paymentMethod: string, priceId: string }) {
    try {
      let customerId;

      try {
        // Essayez de récupérer l'ID du client
        customerId = await this.stripeService.retrieveCustomer(body.email);
      } catch (error) {
        // Si le client n'existe pas, créez un nouveau client
        const customer = await this.stripeService.createCustomer(body.email, body.paymentMethod);
        customerId = customer.id;
      }

      const subscription = await this.stripeService.createSubscription(customerId, body.priceId);
      return { success: true, subscription };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }

  @Get('prices')
  async getPrices() {
    return this.stripeService.getPrices();
  }

  @Post('purchase')
  async createOneTimePurchase(@Body() body: { email: string, paymentMethod: string, idMagazine: number, successUrl: string, cancelUrl: string }) {

    const magazineId = await this.magazineService.getMagazinePriceId(body.idMagazine);
    try {
      let customerId;

      try {
        // Essayez de récupérer l'ID du client
        customerId = await this.stripeService.retrieveCustomer(body.email);
      } catch (error) {
        // Si le client n'existe pas, créez un nouveau client
        const customer = await this.stripeService.createCustomer(body.email, body.paymentMethod);
        customerId = customer.id;
      }

      const session = await this.stripeService.createCheckoutSessionForOneTimePurchase(body.email, magazineId, body.successUrl, body.cancelUrl, body.paymentMethod);
      return { success: true, session };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }
}