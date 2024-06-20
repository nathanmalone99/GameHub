import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RawgService } from './rawg.service';

describe('RawgService', () => {
  let service: RawgService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RawgService]
    });
    service = TestBed.inject(RawgService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch games', () => {
    const dummyGames = {
      results: [
        { id: 1, name: 'Game 1', background_image: 'image1.jpg', released: '2020-01-01' },
        { id: 2, name: 'Game 2', background_image: 'image2.jpg', released: '2020-01-02' },
      ],
      count: 100
    };

    service.getGames(1, 20).subscribe(games => {
      expect(games.results.length).toBe(2);
      expect(games.results).toEqual(dummyGames.results);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/games?key=${service['apiKey']}&page=1&page_size=20`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyGames);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
