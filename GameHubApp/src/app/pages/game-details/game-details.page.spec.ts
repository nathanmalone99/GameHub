import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailsPage } from './game-details.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RawgService } from 'src/app/services/rawg.service';
import { ReviewService } from 'src/app/services/review.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseMockConfig } from 'src/app/testing/firebase.mock';

describe('GameDetailsPage', () => {
  let component: GameDetailsPage;
  let fixture: ComponentFixture<GameDetailsPage>;
  let rawgService: jasmine.SpyObj<RawgService>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const rawgServiceSpy = jasmine.createSpyObj('RawgService', ['getGameDetails', 'getGameAdditions', 'getGameScreenshots', 'getReviews']);
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['getReviews', 'submitReview']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['user$']);

    rawgServiceSpy.getGameDetails.and.returnValue(of({ tags: [] }));
    rawgServiceSpy.getGameAdditions.and.returnValue(of({ results: [] }));
    rawgServiceSpy.getGameScreenshots.and.returnValue(of({ results: [] }));
    reviewServiceSpy.getReviews.and.returnValue(of([]));
    authServiceSpy.user$ = of(null);

    await TestBed.configureTestingModule({
      declarations: [GameDetailsPage],
      imports: [
        HttpClientTestingModule,
        AngularFireModule.initializeApp(firebaseMockConfig),
        AngularFirestoreModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } },
        { provide: RawgService, useValue: rawgServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GameDetailsPage);
    component = fixture.componentInstance;
    rawgService = TestBed.inject(RawgService) as jasmine.SpyObj<RawgService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
