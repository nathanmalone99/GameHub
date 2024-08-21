import { TestBed } from '@angular/core/testing';
import { FavouritesService } from './favourites.service';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseMockConfig } from '../testing/firebase.mock';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of, throwError } from 'rxjs';
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
        set: jasmine.createSpy('set').and.returnValue(Promise.resolve(void 0)),
        delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve(void 0)),
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

  it('should not add to favorites if user is not authenticated', (done) => {
    afAuthMock.authState = of(null);
    const game = { id: 1, name: 'Test Game' };
    service.addToFavorites(game).subscribe((result) => {
      expect(afsMock.collection).not.toHaveBeenCalled();
      expect(result).toBeNull();
      done();
    });
  });

  it('should return empty array when getting favorites if user is not authenticated', (done) => {
    afAuthMock.authState = of(null);
    service.getFavorites().subscribe((favorites) => {
      expect(afsMock.collection).not.toHaveBeenCalled();
      expect(favorites).toEqual([]);
      done();
    });
  });

  it('should not remove from favorites if user is not authenticated', (done) => {
    afAuthMock.authState = of(null);
    service.removeFromFavorites('1').subscribe((result) => {
      expect(afsMock.collection).not.toHaveBeenCalled();
      expect(result).toBeNull();
      done();
    });
  });

  it('should not update game status if user is not authenticated', (done) => {
    afAuthMock.authState = of(null);
    const gameId = 1;
    const status = 'In Progress';
    service.updateGameStatus(gameId, status).subscribe((result) => {
      expect(afsMock.collection).not.toHaveBeenCalled();
      expect(result).toBeNull();
      done();
    });
  });

  it('should handle errors when adding to favorites', (done) => {
    afsMock.collection().doc().set.and.returnValue(Promise.reject('Error adding to favorites'));
    const game = { id: 1, name: 'Test Game' };
    service.addToFavorites(game).subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error).toBe('Error adding to favorites');
        done();
      },
    });
  });

  it('should handle errors when removing from favorites', (done) => {
    afsMock.collection().doc().delete.and.returnValue(Promise.reject('Error removing from favorites'));
    service.removeFromFavorites('1').subscribe({
      next: () => fail('Expected an error, but got a success response'),
      error: (error) => {
        expect(error).toBe('Error removing from favorites');
        done();
      },
    });
  });

  it('should work with a different user ID', (done) => {
    afAuthMock.authState = of({ uid: 'anotherUserId' });
    const game = { id: 1, name: 'Test Game' };
    service.addToFavorites(game).subscribe(() => {
      expect(afsMock.collection).toHaveBeenCalledWith('users/anotherUserId/favorites');
      expect(afsMock.collection().doc).toHaveBeenCalledWith('1');
      expect(afsMock.collection().doc().set).toHaveBeenCalledWith(game);
      done();
    });
  });

  it('should handle empty authState', (done) => {
    afAuthMock.authState = of(null);
    service.getFavorites().subscribe((favorites) => {
      expect(favorites).toEqual([]);
      done();
    });
  });
});
