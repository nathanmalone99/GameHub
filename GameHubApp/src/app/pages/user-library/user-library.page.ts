import { Component, OnInit } from '@angular/core';
import { SteamService } from 'src/app/services/steam.service';

@Component({
  selector: 'app-user-library',
  templateUrl: './user-library.page.html',
  styleUrls: ['./user-library.page.scss'],
})
export class UserLibraryPage implements OnInit {

  steamGames: any[] = [];

  constructor(private steamService: SteamService) {}

  ngOnInit() {
    this.loadSteamGames('76561198984987297');
  }

  loadSteamGames(steamId: string) {
    this.steamService.getUserGameLibrary(steamId).subscribe(data => {
      this.steamGames = data.response.games;
    });
  }
}
