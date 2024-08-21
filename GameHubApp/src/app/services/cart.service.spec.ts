import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a game to the cart', () => {
    const game = { id: 1, name: 'Game 1', price: '10.00' };
    service.addToCart(game);

    expect(service.getCart()).toEqual([game]);
  });

  it('should add multiple games to the cart', () => {
    const game1 = { id: 1, name: 'Game 1', price: '10.00' };
    const game2 = { id: 2, name: 'Game 2', price: '20.00' };
    
    service.addToCart(game1);
    service.addToCart(game2);

    expect(service.getCart()).toEqual([game1, game2]);
  });

  it('should remove a game from the cart', () => {
    const game1 = { id: 1, name: 'Game 1', price: '10.00' };
    const game2 = { id: 2, name: 'Game 2', price: '20.00' };

    service.addToCart(game1);
    service.addToCart(game2);
    service.removeFromCart(1);

    expect(service.getCart()).toEqual([game2]);
  });

  it('should clear the cart', () => {
    const game1 = { id: 1, name: 'Game 1', price: '10.00' };
    const game2 = { id: 2, name: 'Game 2', price: '20.00' };

    service.addToCart(game1);
    service.addToCart(game2);
    service.clearCart();

    expect(service.getCart()).toEqual([]);
  });

  it('should return the current cart contents', () => {
    const game1 = { id: 1, name: 'Game 1', price: '10.00' };
    const game2 = { id: 2, name: 'Game 2', price: '20.00' };

    service.addToCart(game1);
    service.addToCart(game2);

    expect(service.getCart()).toEqual([game1, game2]);
  });

  it('should handle removing a game not in the cart gracefully', () => {
    const game1 = { id: 1, name: 'Game 1', price: '10.00' };
    service.addToCart(game1);

    service.removeFromCart(999);
    expect(service.getCart()).toEqual([game1]);
  });

  it('should not add a game with duplicate ID to the cart', () => {
    const game = { id: 1, name: 'Game 1', price: '10.00' };
    service.addToCart(game);
    service.addToCart(game);

    expect(service.getCart()).toEqual([game]);
  });
});
