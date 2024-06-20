import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) { }

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
}
