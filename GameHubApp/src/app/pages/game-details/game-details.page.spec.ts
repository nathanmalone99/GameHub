import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailsPage } from './game-details.page';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RawgService } from 'src/app/services/rawg.service';
import { ReviewService } from 'src/app/services/review.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseMockConfig } from 'src/app/testing/firebase.mock';
import firebase from 'firebase/compat/app';

describe('GameDetailsPage', () => {
  let component: GameDetailsPage;
  let fixture: ComponentFixture<GameDetailsPage>;
  let rawgService: jasmine.SpyObj<RawgService>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const rawgServiceSpy = jasmine.createSpyObj('RawgService', [
      'getGameDetails', 'getGameAdditions', 'getGameScreenshots', 'getReviews'
    ]);
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['getReviews', 'submitReview']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['user$']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GameDetailsPage);
    component = fixture.componentInstance;
    rawgService = TestBed.inject(RawgService) as jasmine.SpyObj<RawgService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load game details on init', () => {
    expect(rawgService.getGameDetails).toHaveBeenCalledWith('123');
    expect(component.gameTags).toEqual([]);
  });

  it('should load game additions on init', () => {
    expect(rawgService.getGameAdditions).toHaveBeenCalledWith('123', component.page, component.pageSize);
    expect(component.gameAdditions).toEqual([]);
  });

  it('should load game screenshots on init', () => {
    expect(rawgService.getGameScreenshots).toHaveBeenCalledWith('123', component.page, component.pageSize);
    expect(component.gameScreenshots).toEqual([]);
  });

  it('should load reviews on init', () => {
    expect(reviewService.getReviews).toHaveBeenCalledWith('123');
    expect(component.reviews).toEqual([]);
  });

  it('should redirect to achievements page', () => {
    component.goToAchievements('123');
    expect(router.navigate).toHaveBeenCalledWith(['/achievements', '123']);
  });

  it('should submit a review', async () => {
    const mockUser = { email: 'test@example.com' };
    authService.user$ = of(mockUser as firebase.User);
    component.user = mockUser as firebase.User;
    component.gameId = '123';
    component.reviewText = 'Great game!';
    component.rating = 5;
  
    reviewService.submitReview.and.returnValue(Promise.resolve());
  
    await component.submitReview();
  
    expect(reviewService.submitReview).toHaveBeenCalledWith({
      gameId: '123',
      text: 'Great game!',
      rating: 5,
      userEmail: 'test@example.com',
      createdAt: jasmine.any(Object)
    });
    expect(component.reviewText).toBe('');
    expect(component.rating).toBe(0);
  });

  it('should not submit a review if the user is not logged in', async () => {
    spyOn(window, 'alert');
    component.user = null;
    component.submitReview();
    expect(window.alert).toHaveBeenCalledWith('You must be logged in to submit a review.');
    expect(reviewService.submitReview).not.toHaveBeenCalled();
  });

  it('should not submit a review if gameId is null', async () => {
    spyOn(console, 'error');
    component.user = { email: 'test@example.com' } as firebase.User;
    component.gameId = null as any;
    await component.submitReview();
    expect(console.error).toHaveBeenCalledWith('Game ID is null');
    expect(reviewService.submitReview).not.toHaveBeenCalled();
  });

  it('should set the rating', () => {
    component.setRating(4);
    expect(component.rating).toBe(4);
  });
});
