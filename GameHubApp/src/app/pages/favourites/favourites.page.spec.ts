import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouritesPage } from './favourites.page';
import { FavouritesService } from 'src/app/services/favourites.service';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { firebaseMockConfig } from 'src/app/testing/firebase.mock';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

describe('FavouritesPage', () => {
  let component: FavouritesPage;
  let fixture: ComponentFixture<FavouritesPage>;
  let favouritesService: jasmine.SpyObj<FavouritesService>;

  const mockFavorites = [
    { id: 1, name: 'Game 1', background_image: 'image1.jpg', released: '2020-01-01' },
    { id: 2, name: 'Game 2', background_image: 'image2.jpg', released: '2020-01-02' }
  ];

  beforeEach(async () => {
    const favouritesServiceSpy = jasmine.createSpyObj('FavouritesService', ['getFavorites', 'removeFromFavorites']);
    favouritesServiceSpy.getFavorites.and.returnValue(of(mockFavorites));
    favouritesServiceSpy.removeFromFavorites.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      declarations: [FavouritesPage],
      imports: [
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(firebaseMockConfig),
        AngularFirestoreModule
      ],
      providers: [
        { provide: FavouritesService, useValue: favouritesServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesPage);
    component = fixture.componentInstance;
    favouritesService = TestBed.inject(FavouritesService) as jasmine.SpyObj<FavouritesService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorite games on init', () => {
    expect(component.favoriteGames).toEqual(mockFavorites);
    expect(favouritesService.getFavorites).toHaveBeenCalled();
  });

  it('should remove game from favorites', () => {
    component.removeFromFavorites('1');
    expect(favouritesService.removeFromFavorites).toHaveBeenCalledWith('1');
  });
});