import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private stripePublicKey = environment.stripePublicKey;
  private firebaseFunctionUrl = environment.firebaseFunctionUrl;
  private stripePromise = loadStripe(this.stripePublicKey);

  constructor(private http: HttpClient) {}

  async createPaymentIntent(amount: number) {
    return this.http.post<{ clientSecret: string }>(this.firebaseFunctionUrl, { amount }).toPromise();
  }

  async getStripe() {
    return this.stripePromise;
  }

  async redirectToCheckout(cartItems: any[]) {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Create line items for Stripe Checkout
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.background_image],
        },
        unit_amount: item.price * 100, // amount in cents
      },
      quantity: 1,
    }));

    // Call your backend to create a Checkout Session
    const session = await this.http.post<{ id: string }>(
      `${this.firebaseFunctionUrl}/create-checkout-session`,
      { lineItems }
    ).toPromise();

    if (!session) {
      throw new Error('Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  }
}
