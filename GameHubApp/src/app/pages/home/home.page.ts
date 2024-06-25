import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FavouritesService } from 'src/app/services/favourites.service';
import { RawgService } from 'src/app/services/rawg.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  games: any[] = [];
  currentPage = 1;
  totalPages = 0;
  pageSize = 20;
  loading = false;
  filters = {
    search: '',
    genres: '',
    platforms: '',
    ordering: ''
  };

  constructor(private rawgService: RawgService, private favouritesService: FavouritesService, private router: Router) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    if (this.loading) return;

    this.loading = true;
    this.rawgService.getGames(this.currentPage, this.pageSize, this.filters).subscribe(
      (response) => {
        console.log('API response:', response);

        if (response && response.results) {
          this.games = response.results;
          this.totalPages = Math.ceil(response.count / this.pageSize);
        }

        this.loading = false;
      },
      (error) => {
        console.error('API error:', error);
        this.loading = false;
      }
    );
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadGames();
  }

  clearFilters() {
    this.filters = {
      search: '',
      genres: '',
      platforms: '',
      ordering: ''
    };
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadGames();
    }
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  addToFavorites(game: any) {
    this.favouritesService.addToFavorites(game).subscribe(() => {
      console.log('Added to favorites');
    });
  }

  goToGameDetails(gameId: string) {
    this.router.navigate(['/game-details', gameId]);
  }
}
