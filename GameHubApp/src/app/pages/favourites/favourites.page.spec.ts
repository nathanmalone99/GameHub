import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { FavouritesPage } from './favourites.page';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouritesService } from 'src/app/services/favourites.service';
import { IonicModule, NavController } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { firebaseMockConfig } from 'src/app/testing/firebase.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

const mockFavorites = [
  { id: 1, name: 'Game 1', background_image: 'image1.jpg', released: '2020-01-01' },
  { id: 2, name: 'Game 2', background_image: 'image2.jpg', released: '2020-01-02' }
];

const collectionStub = {
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of(mockFavorites)),
  doc: jasmine.createSpy('doc').and.returnValue({
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve()),
    update: jasmine.createSpy('update').and.returnValue(Promise.resolve())
  })
};

const angularFirestoreStub = {
  collection: jasmine.createSpy('collection').and.returnValue(collectionStub)
};

describe('FavouritesPage', () => {
  let component: FavouritesPage;
  let fixture: ComponentFixture<FavouritesPage>;
  let favouritesService: jasmine.SpyObj<FavouritesService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const favouritesServiceSpy = jasmine.createSpyObj('FavouritesService', ['getFavorites', 'removeFromFavorites', 'updateGameStatus']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    favouritesServiceSpy.getFavorites.and.returnValue(of(mockFavorites));
    favouritesServiceSpy.removeFromFavorites.and.returnValue(of(void 0));
    favouritesServiceSpy.updateGameStatus.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      declarations: [FavouritesPage],
      imports: [
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(firebaseMockConfig),
        AngularFirestoreModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: FavouritesService, useValue: favouritesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesPage);
    component = fixture.componentInstance;
    favouritesService = TestBed.inject(FavouritesService) as jasmine.SpyObj<FavouritesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load favorite games on init', () => {
    fixture.detectChanges();
    expect(component.favoriteGames).toEqual(mockFavorites);
    expect(favouritesService.getFavorites).toHaveBeenCalled();
  });

  it('should remove game from favorites', () => {
    fixture.detectChanges();
    component.removeFromFavorites('1');
    expect(favouritesService.removeFromFavorites).toHaveBeenCalledWith('1');
  });

  it('should update game status', () => {
    fixture.detectChanges();
    const gameId = '1';
    const status = 'In Progress';
  
    component.updateGameStatus(gameId, status);

    expect(favouritesService.updateGameStatus).toHaveBeenCalledWith(gameId, status);
  });

  it('should navigate to game details', () => {
    fixture.detectChanges();
    const gameId = '1';

    component.goToGameDetails(gameId);

    expect(router.navigate).toHaveBeenCalledWith(['/game-details', gameId]);
  });

  it('should navigate to achievements', () => {
    fixture.detectChanges();
    const gameId = '1';

    component.goToAchievements(gameId);

    expect(router.navigate).toHaveBeenCalledWith(['/achievements', gameId]);
  });

  it('should initialize with correct default values', () => {
    expect(component.favoriteGames).toEqual([]);
  });
});
