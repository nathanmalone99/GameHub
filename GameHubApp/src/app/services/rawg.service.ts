import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RawgService {

  private apiKey = '6f16f1bd149e41ae9eaf8f3a0a394e5b';  
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
    return this.http.get(url, { params });
  }
}
