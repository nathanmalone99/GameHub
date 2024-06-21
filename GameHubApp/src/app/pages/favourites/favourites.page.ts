import { Component, OnInit } from '@angular/core';
import { FavouritesService } from 'src/app/services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

  favoriteGames: any[] = [];

  constructor(private favouritesService: FavouritesService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favouritesService.getFavorites().subscribe(games => {
      this.favoriteGames = games;
    });
  }

  removeFromFavorites(gameId: string) {
    this.favouritesService.removeFromFavorites(gameId).subscribe(() => {
      this.loadFavorites();
    });
  }
}