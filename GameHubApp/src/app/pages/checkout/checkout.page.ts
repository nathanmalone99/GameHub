import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  cartItems: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService, private stripeService: StripeService) { }

  ngOnInit() {
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  }

  async checkout() {
    await this.stripeService.redirectToCheckout(this.cartItems);
  }
}
