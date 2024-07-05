import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomCheckoutPage } from './custom-checkout.page';

describe('CustomCheckoutPage', () => {
  let component: CustomCheckoutPage;
  let fixture: ComponentFixture<CustomCheckoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCheckoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
