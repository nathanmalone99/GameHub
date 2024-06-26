import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XboxService {

  private apiUrl = 'https://xboxapi.com/v2';

  constructor(private http: HttpClient) {}

  getUserGameLibrary(xuid: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Auth': token,
    });
    const url = `${this.apiUrl}/${xuid}/xboxonegames`;
    return this.http.get<any>(url, { headers });
  }

  getUserAchievements(xuid: string, titleId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Auth': token,
    });
    const url = `${this.apiUrl}/${xuid}/achievements/${titleId}`;
    return this.http.get<any>(url, { headers });
  }
}
