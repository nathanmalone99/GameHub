/* import { Component, OnInit } from '@angular/core';
import { Stripe, StripeCardElement  } from '@stripe/stripe-js';
import { CartService } from 'src/app/services/cart.service';
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-custom-checkout',
  templateUrl: './custom-checkout.page.html',
  styleUrls: ['./custom-checkout.page.scss'],
})
export class CustomCheckoutPage implements OnInit {

  private stripe!: Stripe;
  private elements: any;
  private card!: StripeCardElement;
  private total: number = 0;

  constructor(
    private stripeService: StripeService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    this.total = this.cartService.getCart().reduce((sum, item) => sum + parseFloat(item.price), 0);
    const stripeInstance = await this.stripeService.getStripe();
    if (stripeInstance) {
      this.stripe = stripeInstance;
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    } else {
      console.error('Stripe failed to load.');
    }
  }

  async handlePayment() {
    const paymentIntent = await this.stripeService.createPaymentIntent(this.total);
    const clientSecret = paymentIntent?.clientSecret;

    if (clientSecret) {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
        },
      });

      if (result.error) {
        console.error(result.error.message);
      } else {
        if (result.paymentIntent?.status === 'succeeded') {
          console.log('Payment successful!');
          this.cartService.clearCart();
        }
      }
    } else {
      console.error('Failed to create payment intent.');
    }
  }
}
 */