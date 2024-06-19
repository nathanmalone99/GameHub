import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RawgService {

  private apiKey = '6f16f1bd149e41ae9eaf8f3a0a394e5b';  
  private apiUrl = 'https://api.rawg.io/api';

  constructor(private http: HttpClient) {}

  
  getGames(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/games`, {
      params: {
        key: this.apiKey,
        page: page.toString(),
        page_size: pageSize.toString()
      }
    });
  }
}
