import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async createCustomer(email: string, paymentMethod: string): Promise<Stripe.Customer> {
    // Recherchez l'utilisateur dans votre base de données
    const user = await this.usersRepository.findOneBy({ email });

    // Si aucun utilisateur n'est trouvé, lancez une erreur
    if (!user) {
      throw new Error(`No user found with email: ${email}`);
    }

    // Créez un nouveau client Stripe avec le prénom et le nom de famille de l'utilisateur
    const customer = await this.stripe.customers.create({
      name: `${user.firstName} ${user.lastName}`,
      email,
      payment_method: paymentMethod,
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    // Mettez à jour l'utilisateur dans la base de données avec l'ID du client Stripe
    user.stripeCustomerId = customer.id;
    await this.usersRepository.save(user);

    return customer;
  }

  async deleteCustomer(customerId: string) {
    const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
    if (customer) {
      const email = customer.email;
      await this.stripe.customers.del(customerId);
      await this.removeStripeCustomerId(email);
    }
  }

  async removeStripeCustomerId(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user && user.stripeCustomerId) {
      user.stripeCustomerId = null;
      await this.usersRepository.save(user);
    }
  }

  async retrieveCustomer(email: string): Promise<string> {
    // Rechercher l'utilisateur dans la base de données
    const user = await this.usersRepository.findOneBy({ email });

    if (user && user.stripeCustomerId) {
      // Si l'utilisateur existe déjà et a un ID de client Stripe, retournez l'ID du client Stripe
      return user.stripeCustomerId;
    } else {
      throw new Error('User not found or does not have a Stripe customer ID');
    }
  }

  async createSubscription(customerId: string, priceId: string) {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
    });
  }

  async cancelSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  async updateSubscription(subscriptionId: string, data: Stripe.SubscriptionUpdateParams) {
    return await this.stripe.subscriptions.update(subscriptionId, data);
  }

  async retrieveSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async createCheckoutSession(email: string, priceId: string, successUrl: string, cancelUrl: string, paymentMethod: string) {
    let customerId;

    try {
      // Essayez de récupérer l'ID du client
      customerId = await this.retrieveCustomer(email);
    } catch (error) {
      // Si le client n'existe pas, créez un nouveau client
      const customer = await this.createCustomer(email, paymentMethod);
      customerId = customer.id;
    }

    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async createCheckoutSessionForOneTimePurchase(email: string, priceId: string, successUrl: string, cancelUrl: string, paymentMethod: string) {
    let customerId;

    try {
      // Essayez de récupérer l'ID du client
      customerId = await this.retrieveCustomer(email);
    } catch (error) {
      // Si le client n'existe pas, créez un nouveau client
      const customer = await this.createCustomer(email, paymentMethod);
      customerId = customer.id;
    }

    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async createPrice(productId: string, unitAmount: number, currency: string = 'eur') {
    return await this.stripe.prices.create({
      product: productId,
      unit_amount: unitAmount,
      currency,
      recurring: {
        interval: 'month',
        interval_count: 1,
        usage_type: 'licensed',
      },
    });
  }

  async getUserSubscriptionId(userId: string): Promise<string | null> {
    const user = await this.usersRepository.findOneById(userId);

    return user ? user.subscriptionId : null;
  }

  async checkAndCancelSubscription(userId: string) {
    // Assume that you have a method to get a user's subscription ID by their user ID
    const subscriptionId = await this.getUserSubscriptionId(userId);

    if (subscriptionId) {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      // Liste des IDs de prix des abonnements que vous souhaitez annuler après 12 mois
      const priceIdsToCancel = ['price_1PJBodG3h0hR2My9gCSW9wW0', 'price_1PJBraG3h0hR2My9SKGG7k7C', 'price_1PIxFDG3h0hR2My9xSL332ek'];

      if (subscription.created && Math.floor((Date.now() / 1000 - subscription.created) / (60 * 60 * 24 * 30)) >= 12) {
        // Vérifie si l'ID du prix de l'abonnement est dans la liste des IDs à annuler
        if (priceIdsToCancel.includes(subscription.items.data[0].price.id)) {
          await this.cancelSubscription(subscription.id);
        }
      }
    }
  }

  async getPrices() {
    return this.stripe.prices.list({ expand: ['data.product'], limit: 10 });
  }

  async getBillingPortalSessionUrl(customerId: string, returnUrl: string): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }
}

