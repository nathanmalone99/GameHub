import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';


@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe('');
  }

  async redirectToCheckout(items: any[]): Promise<void> {
    const stripe = await this.stripePromise;

    if (stripe) {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        console.error(result.error.message);
      }
    }
  }
}
