import { Component } from '@angular/core';
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

  constructor(private rawgService: RawgService) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    if (this.loading) return;

    this.loading = true;
    this.rawgService.getGames(this.currentPage, this.pageSize).subscribe(
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
}