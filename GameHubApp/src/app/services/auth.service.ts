import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user$ = this.afAuth.authState;
  }

  async register(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(user: firebase.User, username: string, firstName: string, lastName: string) {
    try {
      await this.firestore.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        username: username,
        firstName: firstName,
        lastName: lastName
      });
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      throw error;
    }
  }
}

