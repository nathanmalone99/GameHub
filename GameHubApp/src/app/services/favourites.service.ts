import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  addToFavorites(game: any) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const userFavoritesRef = this.afs.collection(
            `users/${user.uid}/favorites`
          );
          return userFavoritesRef.doc(game.id.toString()).set(game);
        } else {
          return of(null);
        }
      })
    );
  }

  getFavorites() {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`users/${user.uid}/favorites`)
            .valueChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  removeFromFavorites(gameId: string | number) {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          const userFavoritesRef = this.afs.collection(`users/${user.uid}/favorites`);
          const gameDocId = gameId.toString();
          return userFavoritesRef.doc(gameDocId).delete();
        } else {
          return of(null);
        }
      })
    );
}

  updateGameStatus(gameId: string | number, status: string) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const userFavoritesRef = this.afs.collection(
            `users/${user.uid}/favorites`
          );
          const gameDocId = gameId.toString();
          console.log(
            `Updating game ${gameDocId} for user ${user.uid} with status: ${status}`
          );
          return userFavoritesRef
            .doc(gameDocId)
            .update({ status: status })
            .then(() => console.log('Status updated successfully'))
            .catch((error) => console.error('Error updating status:', error));
        } else {
          console.log('No user authenticated');
          return of(null);
        }
      })
    );
  }
}
