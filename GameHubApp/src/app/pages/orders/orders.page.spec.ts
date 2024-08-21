import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersPage } from './orders.page';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;
  let orderServiceMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    orderServiceMock = {
      getOrders: jasmine.createSpy('getOrders').and.returnValue(of([{ id: 'order1' }, { id: 'order2' }]))
    };

    authServiceMock = {
      user$: of({ uid: 'testUserId' })
    };

    await TestBed.configureTestingModule({
      declarations: [OrdersPage],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    expect(orderServiceMock.getOrders).toHaveBeenCalled();
    expect(component.orders).toEqual([{ id: 'order1' }, { id: 'order2' }]);
  });

  it('should toggle order details', () => {
    component.toggleOrderDetails(0);
    expect(component.expandedOrders[0]).toBeTrue();

    component.toggleOrderDetails(0);
    expect(component.expandedOrders[0]).toBeFalse();
  });
});
