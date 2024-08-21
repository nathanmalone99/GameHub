import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPage } from './cart.page';
import { CartService } from 'src/app/services/cart.service';
import { StripeService } from 'src/app/services/stripe.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let cartServiceMock: any;
  let stripeServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    cartServiceMock = {
      cart$: of([]),
      clearCart: jasmine.createSpy('clearCart'),
      removeFromCart: jasmine.createSpy('removeFromCart')
    };

    stripeServiceMock = {
      createCheckoutSession: jasmine.createSpy('createCheckoutSession').and.returnValue(Promise.resolve())
    };

    authServiceMock = {
      user$: of(null)
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [CartPage],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: StripeService, useValue: stripeServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should calculate the total when cart items change', () => {
    const mockCartItems = [
      { id: 1, name: 'Game 1', price: '10.00' },
      { id: 2, name: 'Game 2', price: '20.00' },
    ];

    cartServiceMock.cart$ = of(mockCartItems);
    fixture.detectChanges();

    expect(component.total).toBe(30);
  });

  it('should clear the cart', () => {
    fixture.detectChanges();
    component.clearCart();

    expect(cartServiceMock.clearCart).toHaveBeenCalled();
    expect(component.cartItems.length).toBe(0);
    expect(component.total).toBe(0);
  });

  it('should remove a game from the cart', () => {
    fixture.detectChanges();
    const gameId = 1;
    component.removeGame(gameId);

    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(gameId);
  });

  it('should redirect to login if user is not logged in', async () => {
    fixture.detectChanges();
    await component.proceedToCheckout();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should proceed to checkout if user is logged in', async () => {
    const mockUser = { uid: 'user123' };
    authServiceMock.user$ = of(mockUser);
    cartServiceMock.cart$ = of([{ id: 1, name: 'Game 1', price: '10.00' }]);
    fixture.detectChanges();

    await component.proceedToCheckout();

    expect(stripeServiceMock.createCheckoutSession).toHaveBeenCalledWith([{ id: 1, name: 'Game 1', price: '10.00' }], 'user123');
  });

  it('should log an error if checkout fails', async () => {
    const mockError = new Error('Checkout failed');
    stripeServiceMock.createCheckoutSession.and.returnValue(Promise.reject(mockError));
    const consoleSpy = spyOn(console, 'error');

    const mockUser = { uid: 'user123' };
    authServiceMock.user$ = of(mockUser);
    cartServiceMock.cart$ = of([{ id: 1, name: 'Game 1', price: '10.00' }]);
    fixture.detectChanges();

    await component.proceedToCheckout();

    expect(consoleSpy).toHaveBeenCalledWith('Checkout error:', mockError);
  });

  it('should calculate the total on init', () => {
    const mockCartItems = [
      { id: 1, name: 'Game 1', price: '15.00' },
      { id: 2, name: 'Game 2', price: '25.00' },
    ];

    cartServiceMock.cart$ = of(mockCartItems);
    fixture.detectChanges();

    expect(component.total).toBe(40);
  });
});
