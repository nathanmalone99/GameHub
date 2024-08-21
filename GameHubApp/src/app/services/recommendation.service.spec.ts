import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseMockConfig } from '../testing/firebase.mock';
import { RecommendationService } from './recommendation.service';
import { RawgService } from './rawg.service';
import { of } from 'rxjs';

describe('RecommendationService', () => {
  let service: RecommendationService;
  let rawgServiceSpy: jasmine.SpyObj<RawgService>;

  beforeEach(() => {
    const rawgServiceMock = jasmine.createSpyObj('RawgService', ['getGamesByGenre', 'getGamesByDeveloper', 'getGamesByPublisher']);
    rawgServiceMock.getGamesByGenre.and.returnValue(of([]));
    rawgServiceMock.getGamesByDeveloper.and.returnValue(of([]));
    rawgServiceMock.getGamesByPublisher.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseMockConfig),
        AngularFirestoreModule,
        AngularFireAuthModule
      ],
      providers: [
        { provide: RawgService, useValue: rawgServiceMock }
      ]
    });

    service = TestBed.inject(RecommendationService);
    rawgServiceSpy = TestBed.inject(RawgService) as jasmine.SpyObj<RawgService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty array if user has no favorite games', () => {
    spyOn(service, 'getUserFavorites').and.returnValue(of([]));

    service.getRecommendations('userId').subscribe(recommendations => {
      expect(recommendations).toEqual([]);
    });

    expect(service.getUserFavorites).toHaveBeenCalledWith('userId');
  });

  it('should fetch recommendations based on favorite genres', () => {
    const favoriteGames = [
      { id: 1, genres: [{ id: 'genre1' }], developers: [], publishers: [] },
    ];
    const genreRecommendations = [{ id: 2, name: 'Genre Based Game' }];

    spyOn(service, 'getUserFavorites').and.returnValue(of(favoriteGames));
    rawgServiceSpy.getGamesByGenre.and.returnValue(of({ results: genreRecommendations }));

    service.getRecommendations('userId').subscribe(recommendations => {
      expect(recommendations).toEqual(genreRecommendations);
    });

    expect(service.getUserFavorites).toHaveBeenCalledWith('userId');
    expect(rawgServiceSpy.getGamesByGenre).toHaveBeenCalledWith('genre1');
  });

  it('should fetch recommendations based on favorite developers', () => {
    const favoriteGames = [
      { id: 1, genres: [], developers: [{ id: 'dev1' }], publishers: [] },
    ];
    const developerRecommendations = [{ id: 3, name: 'Developer Based Game' }];

    spyOn(service, 'getUserFavorites').and.returnValue(of(favoriteGames));
    rawgServiceSpy.getGamesByDeveloper.and.returnValue(of({ results: developerRecommendations }));

    service.getRecommendations('userId').subscribe(recommendations => {
      expect(recommendations).toEqual(developerRecommendations);
    });

    expect(service.getUserFavorites).toHaveBeenCalledWith('userId');
    expect(rawgServiceSpy.getGamesByDeveloper).toHaveBeenCalledWith('dev1');
  });

  it('should fetch recommendations based on favorite publishers', () => {
    const favoriteGames = [
      { id: 1, genres: [], developers: [], publishers: [{ id: 'pub1' }] },
    ];
    const publisherRecommendations = [{ id: 4, name: 'Publisher Based Game' }];

    spyOn(service, 'getUserFavorites').and.returnValue(of(favoriteGames));
    rawgServiceSpy.getGamesByPublisher.and.returnValue(of({ results: publisherRecommendations }));

    service.getRecommendations('userId').subscribe(recommendations => {
      expect(recommendations).toEqual(publisherRecommendations);
    });

    expect(service.getUserFavorites).toHaveBeenCalledWith('userId');
    expect(rawgServiceSpy.getGamesByPublisher).toHaveBeenCalledWith('pub1');
  });

  it('should remove duplicate recommendations', () => {
    const favoriteGames = [
      { id: 1, genres: [{ id: 'genre1' }], developers: [], publishers: [] },
    ];
    const recommendationsWithDuplicates = [
      { id: 2, name: 'Game A' },
      { id: 2, name: 'Game A' },
    ];

    spyOn(service, 'getUserFavorites').and.returnValue(of(favoriteGames));
    rawgServiceSpy.getGamesByGenre.and.returnValue(of({ results: recommendationsWithDuplicates }));

    service.getRecommendations('userId').subscribe(recommendations => {
      expect(recommendations.length).toBe(1);
      expect(recommendations[0].name).toBe('Game A');
    });

    expect(service.getUserFavorites).toHaveBeenCalledWith('userId');
  });

  it('should filter out already favorited games from recommendations', () => {
    const favoriteGames = [
      { id: 1, genres: [{ id: 'genre1' }], developers: [], publishers: [] },
    ];
    const genreRecommendations = [
      { id: 1, name: 'Already Favorited Game' },
      { id: 2, name: 'New Game' },
    ];

    spyOn(service, 'getUserFavorites').and.returnValue(of(favoriteGames));
    rawgServiceSpy.getGamesByGenre.and.returnValue(of({ results: genreRecommendations }));

    service.getRecommendations('userId').subscribe(recommendations => {
      expect(recommendations.length).toBe(1);
      expect(recommendations[0].name).toBe('New Game');
    });

    expect(service.getUserFavorites).toHaveBeenCalledWith('userId');
    expect(rawgServiceSpy.getGamesByGenre).toHaveBeenCalledWith('genre1');
  });
});
