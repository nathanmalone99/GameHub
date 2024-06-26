import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserLibraryPage } from './user-library.page';

describe('UserLibraryPage', () => {
  let component: UserLibraryPage;
  let fixture: ComponentFixture<UserLibraryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLibraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
