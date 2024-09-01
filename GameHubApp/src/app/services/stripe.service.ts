import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  stripePromise = loadStripe(environment.stripePublicKey);

  constructor(private http: HttpClient, private cartService: CartService) {}

  async createCheckoutSession(items: any[], userId: string) {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const response = await this.http
      .post<{ id: string }>('http://localhost:4242/create-checkout-session', { items, userId })
      .toPromise();

    if (!response || !response.id) {
      throw new Error('Failed to create checkout session');
    }

    const result = await stripe.redirectToCheckout({ sessionId: response.id });

    if (!result.error) {
      // Checkout was successful, clear the cart
      this.cartService.clearCart();
    } else {
      console.error(result.error.message);
    }
  }
}
