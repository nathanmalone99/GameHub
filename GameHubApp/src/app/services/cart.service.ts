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
    console.log('CartService: Added game to cart', game);
    console.log('CartService: Current cart', this.cart.value);
  }

  removeFromCart(gameId: number) {
    const currentCart = this.cart.value.filter(game => game.id !== gameId);
    this.cart.next(currentCart);
    console.log('CartService: Removed game from cart', gameId);
    console.log('CartService: Current cart', this.cart.value);
  }

  getCart() {
    console.log('CartService: Getting current cart', this.cart.value);
    return this.cart.value;
  }

  clearCart() {
    this.cart.next([]);
    console.log('CartService: Cart cleared');
  }
}
