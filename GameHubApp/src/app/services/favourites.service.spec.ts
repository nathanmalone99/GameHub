import { TestBed } from '@angular/core/testing';
import { FavouritesService } from './favourites.service';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseMockConfig } from '../testing/firebase.mock';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FavouritesService', () => {
  let service: FavouritesService;
  let afAuthMock: any;
  let afsMock: any;

  beforeEach(() => {
    afAuthMock = {
      authState: of({ uid: 'testUserId' })
    };

    const collectionStub = {
      valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of([{}])),
      doc: jasmine.createSpy('doc').and.returnValue({
        set: jasmine.createSpy('set').and.returnValue(of(void 0)),
        delete: jasmine.createSpy('delete').and.returnValue(of(void 0)),
        update: jasmine.createSpy('update').and.returnValue(Promise.resolve(void 0)),
      })
    };

    afsMock = {
      collection: jasmine.createSpy('collection').and.returnValue(collectionStub)
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularFireModule.initializeApp(firebaseMockConfig),
        AngularFirestoreModule
      ],
      providers: [
        FavouritesService,
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: AngularFirestore, useValue: afsMock }
      ]
    });
    service = TestBed.inject(FavouritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add to favorites', (done) => {
    const game = { id: 1, name: 'Test Game' };
    service.addToFavorites(game).subscribe(() => {
      expect(afsMock.collection).toHaveBeenCalledWith('users/testUserId/favorites');
      expect(afsMock.collection().doc).toHaveBeenCalledWith('1');
      expect(afsMock.collection().doc().set).toHaveBeenCalledWith(game);
      done();
    });
  });

  it('should get favorites', (done) => {
    service.getFavorites().subscribe((favorites) => {
      expect(favorites).toEqual([{}]);
      done();
    });
  });

  it('should remove from favorites', (done) => {
    service.removeFromFavorites('1').subscribe(() => {
      expect(afsMock.collection).toHaveBeenCalledWith('users/testUserId/favorites');
      expect(afsMock.collection().doc).toHaveBeenCalledWith('1');
      expect(afsMock.collection().doc().delete).toHaveBeenCalled();
      done();
    });
  });

  it('should update game status', (done) => {
    const gameId = 1;
    const status = 'In Progress';

    service.updateGameStatus(gameId, status).subscribe(() => {
      expect(afsMock.collection).toHaveBeenCalledWith('users/testUserId/favorites');
      expect(afsMock.collection().doc).toHaveBeenCalledWith('1');
      expect(afsMock.collection().doc().update).toHaveBeenCalledWith({ status });
      done();
    });
  });
});
