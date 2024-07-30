import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgService } from 'src/app/services/rawg.service';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
})
export class AchievementsPage implements OnInit {

  gameId: string | null = null;
  achievements: any[] = [];
  user: firebase.User | null = null;

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to get the currently authenticated user
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    // Retrieve the gameId from the route parameters
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.loadAchievements();
    }
  }

  loadAchievements(page: number = 1) {
    if (this.gameId) {
      this.rawgService.getGameAchievements(this.gameId, page).subscribe(data => {
        this.achievements = this.achievements.concat(data.results);
        // Load user's completed achievements after loading all achievements
        if (data.next) {
          this.loadAchievements(page + 1);
        } else {
          this.loadUserAchievements();
        }
      });
    }
  }

  loadUserAchievements() {
    if (this.user && this.gameId) {
      const userAchievementsRef = this.firestore.collection('userAchievements').doc(this.user.uid).collection(this.gameId);

      userAchievementsRef.get().subscribe(snapshot => {
        snapshot.forEach(doc => {
          const userAchievement = doc.data();
          const achievementIndex = this.achievements.findIndex(ach => ach['name'] === userAchievement['name']);

          if (achievementIndex >= 0) {
            this.achievements[achievementIndex]['completed'] = userAchievement['completed'];
          }
        });
      });
    }
  }

  toggleAchievementCompletion(achievement: any) {
    if (this.user && this.gameId) {
      const achievementRef = this.firestore.collection('userAchievements').doc(this.user.uid).collection(this.gameId).doc(achievement['name']);

      achievement['completed'] = !achievement['completed'];

      achievementRef.set({
        name: achievement['name'],
        completed: achievement['completed']
      }).then(() => {
        console.log('Achievement completion status updated.');
      }).catch(error => {
        console.error('Error updating achievement status:', error);
      });
    }
  }
}
