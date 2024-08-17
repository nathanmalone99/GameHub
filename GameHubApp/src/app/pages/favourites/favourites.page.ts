import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavouritesService } from 'src/app/services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

  favoriteGames: any[] = [];

  constructor(private favouritesService: FavouritesService, private router: Router) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favouritesService.getFavorites().subscribe(games => {
      this.favoriteGames = games;
    });
  }

  removeFromFavorites(gameId: string | number) {
    console.log(typeof gameId);
    this.favouritesService.removeFromFavorites(gameId.toString()).subscribe(() => {
      this.loadFavorites();
    });
}

  updateGameStatus(gameId: string | number, status: string) {
    this.favouritesService.updateGameStatus(gameId.toString(), status).subscribe(() => {
      this.loadFavorites();
    });
}

  goToGameDetails(gameId: string) {
    this.router.navigate(['/game-details', gameId]);
  }

  goToAchievements(gameId: string) {
    this.router.navigate(['/achievements', gameId]);
  }
}