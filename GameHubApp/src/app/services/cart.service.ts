import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  constructor() {}

  addToCart(game: any) {
    const currentCart = this.cart.value;
    currentCart.push(game);
    this.cart.next(currentCart);
  }

  getCart() {
    return this.cart.value;
  }

  clearCart() {
    this.cart.next([]);
  }
}
