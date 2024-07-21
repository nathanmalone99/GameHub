import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RawgService } from 'src/app/services/rawg.service';
import firebase from 'firebase/compat/app';
import { ReviewService } from 'src/app/services/review.service';
import { AuthService } from 'src/app/services/auth.service';


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
  gameId: string = '';
  page: number = 1;
  pageSize: number = 10;
  reviews: any[] = [];
  reviewText: string = '';
  rating: number = 0;
  user: firebase.User | null = null;

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private router: Router,
    private reviewService: ReviewService,
    private authService: AuthService

  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.gameId = gameId;
      this.loadGameDetails(gameId);
      this.loadGameAdditions(gameId);
      this.loadGameScreenshots(gameId);
      this.loadReviews(gameId);
      // this.loadGameMovies(gameId);
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

  loadReviews(gameId: string) {
    this.reviewService.getReviews(gameId).subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  submitReview() {
    if (!this.user) {
      alert('You must be logged in to submit a review.');
      return;
    }

    if (!this.gameId) {
      console.error('Game ID is null');
      return;
    }

    const review = {
      gameId: this.gameId,
      text: this.reviewText,
      rating: this.rating,
      userEmail: this.user.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    console.log('Submitting review:', review);

    this.reviewService.submitReview(review).then(() => {
      console.log('Review submitted successfully');
      this.reviewText = '';
      this.rating = 0;
      this.loadReviews(this.gameId);
    }).catch(error => {
      console.error('Error submitting review:', error);
    });
  }

  setRating(rating: number) {
    this.rating = rating;
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
