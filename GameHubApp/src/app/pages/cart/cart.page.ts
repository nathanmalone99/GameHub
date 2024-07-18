import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { StripeService } from 'src/app/services/stripe.service';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cartItems: any[] = [];
  total: number = 0;
  cartSubscription: Subscription | null = null;
  user: firebase.User | null = null;

  constructor(private cartService: CartService, private stripeService: StripeService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.calculateTotal();
  }

  removeGame(gameId: number) {
    this.cartService.removeFromCart(gameId);
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  }

  async proceedToCheckout() {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.stripeService.createCheckoutSession(this.cartItems, this.user.uid);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  }
}
