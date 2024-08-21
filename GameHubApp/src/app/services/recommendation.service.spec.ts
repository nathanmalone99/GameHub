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
});
