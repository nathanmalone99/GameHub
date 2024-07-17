import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RecommendationService } from 'src/app/services/recommendation.service';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { FavouritesService } from 'src/app/services/favourites.service';


@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.page.html',
  styleUrls: ['./recommendation.page.scss'],
})
export class RecommendationPage implements OnInit {

  recommendedGames: any[] = [];
  user$: Observable<firebase.User | null>;

  constructor(
    private recommendationService: RecommendationService,
    private authService: AuthService,
    private router: Router,
    private favouritesService: FavouritesService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.user$.subscribe((user: firebase.User | null) => {
      if (user) {
        this.recommendationService.getRecommendations(user.uid).subscribe(recommendations => {
          this.recommendedGames = recommendations;
        });
      }
    });
  }

  goToGameDetails(gameId: string) {
    this.router.navigate(['/game-details', gameId]);
  }

  addToFavorites(game: any) {
    this.favouritesService.addToFavorites(game).subscribe(() => {
      console.log('Added to favorites');
    });
  }
}
