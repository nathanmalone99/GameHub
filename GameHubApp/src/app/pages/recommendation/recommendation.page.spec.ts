import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendationPage } from './recommendation.page';

describe('RecommendationPage', () => {
  let component: RecommendationPage;
  let fixture: ComponentFixture<RecommendationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
