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
  pageSize = 10;
  loading = false;

  constructor(private rawgService: RawgService) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames(event?: any) {
    if (this.loading) return;

    this.loading = true;
    this.rawgService.getGames(this.currentPage, this.pageSize).subscribe(
      (response) => {
        console.log('API response:', response);

        if (response && response.results) {
          this.games = [...this.games, ...response.results];
          this.currentPage++;
        }

        this.loading = false;
        if (event) {
          event.target.complete();
        }
      },
      (error) => {
        console.error('API error:', error);
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      }
    );
  }
}