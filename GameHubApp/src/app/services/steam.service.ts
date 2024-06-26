import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SteamService {

  private apiKey = '31D4DDAD93755E11C64FBEC158B8799F';
  
  constructor(private http: HttpClient) {}

  getUserGameLibrary(steamId: string): Observable<any> {
    const url = `/steam-api/IPlayerService/GetOwnedGames/v0001/?key=${this.apiKey}&steamid=${steamId}&include_appinfo=true&format=json`;
    return this.http.get<any>(url);
  }

  getUserAchievements(steamId: string, appId: string): Observable<any> {
    const url = `/steam-api/ISteamUserStats/GetPlayerAchievements/v0001/?key=${this.apiKey}&steamid=${steamId}&appid=${appId}&format=json`;
    return this.http.get<any>(url);
  }
}
