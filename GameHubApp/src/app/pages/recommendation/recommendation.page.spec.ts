import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendationPage } from './recommendation.page';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { AuthService } from 'src/app/services/auth.service';
import { FavouritesService } from 'src/app/services/favourites.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseMockConfig } from 'src/app/testing/firebase.mock';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

const authServiceMock = {
  user$: of({ uid: 'testUserId' })
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecommendationPage],
      imports: [
        RouterTestingModule,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
