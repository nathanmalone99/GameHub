import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RawgService } from './rawg.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private rawgService: RawgService
  ) {}

  getUserFavorites(userId: string): Observable<any[]> {
    return this.afs.collection(`users/${userId}/favorites`).valueChanges();
  }

  getRecommendations(userId: string): Observable<any[]> {
    return this.getUserFavorites(userId).pipe(
      switchMap((favorites: any[]) => {
        if (favorites.length === 0) return of([]);

        const similarGamesRequests = favorites.map((game: any) =>
          this.rawgService.getSimilarGames(game.id)
        );
        return forkJoin(similarGamesRequests);
      }),
      map((similarGamesArrays: any[]) => {
        const recommendations: any[] = [];
        similarGamesArrays.forEach((similarGames: any) => {
          recommendations.push(...similarGames.results);
        });
        // Remove duplicates
        const uniqueRecommendations = recommendations.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return uniqueRecommendations;
      })
    );
  }
}
