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
  filteredGames: any[] = [];
  selectedStatus: string = 'all';

  constructor(private favouritesService: FavouritesService, private router: Router) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favouritesService.getFavorites().subscribe(games => {
      this.favoriteGames = games;
      this.filteredGames = games;
    });
  }

  filterByStatus() {
    if (this.selectedStatus === 'all') {
      this.filteredGames = this.favoriteGames;
    } else {
      this.filteredGames = this.favoriteGames.filter(game => game.status === this.selectedStatus);
    }
  }

  removeFromFavorites(gameId: string | number) {
    this.favouritesService.removeFromFavorites(gameId.toString()).subscribe(() => {
      this.loadFavorites();
      this.filterByStatus();
    });
  }

  updateGameStatus(gameId: string | number, status: string) {
    this.favouritesService.updateGameStatus(gameId.toString(), status).subscribe(() => {
      this.loadFavorites();
      this.filterByStatus();
    });
  }

  goToGameDetails(gameId: string) {
    this.router.navigate(['/game-details', gameId]);
  }

  goToAchievements(gameId: string) {
    this.router.navigate(['/achievements', gameId]);
  }
}
