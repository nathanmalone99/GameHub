import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorefrontPage } from './storefront.page';

describe('StorefrontPage', () => {
  let component: StorefrontPage;
  let fixture: ComponentFixture<StorefrontPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StorefrontPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
