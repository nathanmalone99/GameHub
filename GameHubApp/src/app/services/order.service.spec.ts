import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('OrderService', () => {
  let service: OrderService;
  let firestoreMock: any;
  let authServiceMock: any;

  beforeEach(() => {
    firestoreMock = {
      collection: jasmine.createSpy('collection').and.returnValue({
        valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of([{ id: 'order1' }, { id: 'order2' }]))
      })
    };

    authServiceMock = {
      user$: of({ uid: 'testUserId' })
    };

    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get orders', (done) => {
    service.getOrders().subscribe(orders => {
      expect(orders).toEqual([{ id: 'order1' }, { id: 'order2' }]);
      expect(firestoreMock.collection).toHaveBeenCalledWith('orders', jasmine.any(Function));
      done();
    });
  });
});
