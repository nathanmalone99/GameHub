import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RawgService } from 'src/app/services/rawg.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.page.html',
  styleUrls: ['./game-details.page.scss'],
})
export class GameDetailsPage implements OnInit {

  gameId: string | null = null;
  game: any;

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.loadGameDetails();
  }

  loadGameDetails() {
    if (this.gameId) {
      this.rawgService.getGameDetails(this.gameId).subscribe(game => {
        this.game = game;
      });
    }
  }

  goToAchievements(gameId: string) {
    this.router.navigate(['/achievements', gameId]);
  }
}