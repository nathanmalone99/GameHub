import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RawgService } from 'src/app/services/rawg.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.page.html',
  styleUrls: ['./game-details.page.scss'],
})
export class GameDetailsPage implements OnInit {

  game: any;
  gameTags: any[] = [];
  gameAdditions: any[] = [];
  gameScreenshots: any[] = [];
  gameMovies: any[] = [];
  gameId: string | null = null;
  page: number = 1;
  pageSize: number = 10;

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.loadGameDetails(this.gameId);
      this.loadGameAdditions(this.gameId);
      this.loadGameScreenshots(this.gameId);
      // this.loadGameMovies(this.gameId);
    } else {
      console.error('Game ID is null');
    }
  }

  loadGameDetails(gameId: string) {
    this.rawgService.getGameDetails(gameId).subscribe(game => {
      this.game = game;
      this.gameTags = game.tags;
    });
  }

  goToAchievements(gameId: string) {
    this.router.navigate(['/achievements', gameId]);
  }

  loadGameAdditions(gameId: string) {
    this.rawgService.getGameAdditions(gameId, this.page, this.pageSize).subscribe((data) => {
      this.gameAdditions = data.results;
    });
  }

  loadGameScreenshots(gameId: string) {
    this.rawgService.getGameScreenshots(gameId, this.page, this.pageSize).subscribe((data) => {
      this.gameScreenshots = data.results;
    });
  }

  /* loadGameMovies(gameId: string) {
    this.rawgService.getGameMovies(gameId).subscribe((data) => {
      if (data.results && data.results.length > 0) {
        this.gameMovies = data.results;
      } else {
        console.log('No movies available for this game.');
      }
    });
  } */
}
