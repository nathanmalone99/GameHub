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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
