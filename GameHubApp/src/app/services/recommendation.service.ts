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

        const genreIds = new Set<string>();
        const developerIds = new Set<string>();
        const publisherIds = new Set<string>();

        favorites.forEach((game: any) => {
          if (game.genres) {
            game.genres.forEach((genre: any) => genreIds.add(genre.id));
          }
          if (game.developers) {
            game.developers.forEach((developer: any) => developerIds.add(developer.id));
          }
          if (game.publishers) {
            game.publishers.forEach((publisher: any) => publisherIds.add(publisher.id));
          }
        });

        const genreRequests = Array.from(genreIds).map(genreId =>
          this.rawgService.getGamesByGenre(genreId)
        );
        const developerRequests = Array.from(developerIds).map(developerId =>
          this.rawgService.getGamesByDeveloper(developerId)
        );
        const publisherRequests = Array.from(publisherIds).map(publisherId =>
          this.rawgService.getGamesByPublisher(publisherId)
        );

        return forkJoin([...genreRequests, ...developerRequests, ...publisherRequests]);
      }),
      map((recommendationsArrays: any[]) => {
        const recommendations: any[] = [];
        recommendationsArrays.forEach((games: any) => {
          recommendations.push(...games.results);
        });
        const uniqueRecommendations = recommendations.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return uniqueRecommendations;
      })
    );
  }
}
