import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private firestore: AngularFirestore) {}

  getReviews(gameId: string): Observable<any[]> {
    return this.firestore.collection('reviews', ref => ref.where('gameId', '==', gameId).orderBy('createdAt', 'desc')).valueChanges();
  }

  submitReview(review: any): Promise<void> {
    const id = `${review.gameId}_${review.userEmail}`;
    return this.firestore.collection('reviews').doc(id).set(review);
  }
}
