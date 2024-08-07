import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RawgService {

  private apiKey = environment.rawgApiKey;
  private apiUrl = 'https://api.rawg.io/api';

  constructor(private http: HttpClient) {}

  getGames(page: number = 1, pageSize: number = 10, filters: any = {}): Observable<any> {
    let params = new HttpParams()
      .set('key', this.apiKey)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key]) {
        params = params.set(key, filters[key]);
      }
    }

    return this.http.get<any>(`${this.apiUrl}/games`, { params });
  }

  getGameDetails(gameId: string): Observable<any> {
    const params = new HttpParams().set('key', this.apiKey);
    const url = `${this.apiUrl}/games/${gameId}`;
    return this.http.get<any>(url, { params });
  }

  getGamesByGenre(genreId: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('genres', genreId)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    const url = `${this.apiUrl}/games`;
    return this.http.get<any>(url, { params });
  }

  getGamesByDeveloper(developerId: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('developers', developerId)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    const url = `${this.apiUrl}/games`;
    return this.http.get<any>(url, { params });
  }

  getGamesByPublisher(publisherId: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('publishers', publisherId)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    const url = `${this.apiUrl}/games`;
    return this.http.get<any>(url, { params });
  }

  getGameAchievements(gameId: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('page', page.toString());
    const url = `${this.apiUrl}/games/${gameId}/achievements`;
    return this.http.get(url, { params });
  }

  getGameAdditions(gameId: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiUrl}/games/${gameId}/additions?key=${this.apiKey}&page=${page}&page_size=${pageSize}`;
    return this.http.get<any>(url);
  }

  getGameScreenshots(gameId: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiUrl}/games/${gameId}/screenshots?key=${this.apiKey}&page=${page}&page_size=${pageSize}`;
    return this.http.get<any>(url);
  }

  /* getGameMovies(gameId: string): Observable<any> {
    const url = `${this.apiUrl}/games/${gameId}/movies?key=${this.apiKey}`;
    return this.http.get<any>(url);
  } */
}
