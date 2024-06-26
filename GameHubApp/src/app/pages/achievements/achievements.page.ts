import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgService } from 'src/app/services/rawg.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
})
export class AchievementsPage implements OnInit {

  gameId: string | null = null;
  achievements: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.loadAchievements();
  }

  loadAchievements(page: number = 1) {
    if (this.gameId) {
      this.rawgService.getGameAchievements(this.gameId, page).subscribe(data => {
        console.log('Achievements data:', data); // Log the API response
        this.achievements = this.achievements.concat(data.results);

        // Fetch next page if there are more pages
        if (data.next) {
          this.loadAchievements(page + 1);
        }
      });
    }
  }
}
