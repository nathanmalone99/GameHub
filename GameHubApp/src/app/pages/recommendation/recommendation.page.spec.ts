import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendationPage } from './recommendation.page';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { AuthService } from 'src/app/services/auth.service';
import { FavouritesService } from 'src/app/services/favourites.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseMockConfig } from 'src/app/testing/firebase.mock';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

interface User {
  uid: string;
}

const authServiceMock = {
  user$: of<User | null>({ uid: 'testUserId' })
};

const recommendationServiceMock = {
  getRecommendations: jasmine.createSpy('getRecommendations').and.returnValue(of([]))
};

const favouritesServiceMock = {
  addToFavorites: jasmine.createSpy('addToFavorites').and.returnValue(of(null))
};

describe('RecommendationPage', () => {
  let component: RecommendationPage;
  let fixture: ComponentFixture<RecommendationPage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendationPage],
      imports: [
        RouterTestingModule.withRoutes([]),
        AngularFireModule.initializeApp(firebaseMockConfig),
        AngularFirestoreModule
      ],
      providers: [
        { provide: RecommendationService, useValue: recommendationServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: FavouritesService, useValue: favouritesServiceMock },
        AngularFirestore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recommendations on init', () => {
    expect(recommendationServiceMock.getRecommendations).toHaveBeenCalledWith('testUserId');
    expect(component.recommendedGames).toEqual([]);
  });

  it('should navigate to game details', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const gameId = '123';
    component.goToGameDetails(gameId);
    expect(navigateSpy).toHaveBeenCalledWith(['/game-details', gameId]);
  });

  it('should add a game to favorites', () => {
    const game = { id: '123', name: 'Test Game' };
    const consoleSpy = spyOn(console, 'log');
    component.addToFavorites(game);
    expect(favouritesServiceMock.addToFavorites).toHaveBeenCalledWith(game);
    expect(consoleSpy).toHaveBeenCalledWith('Added to favorites');
  });
});
