import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cartItems: any[] = [];
  total: number = 0;
  cartSubscription: Subscription | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    console.log('CartPage: ngOnInit');
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
      console.log('CartPage: Cart updated', this.cartItems);
    });
  }

  ngOnDestroy() {
    console.log('CartPage: ngOnDestroy');
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.calculateTotal();
    console.log('CartPage: Cart cleared');
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    console.log('CartPage: Total calculated', this.total);
  }
}
