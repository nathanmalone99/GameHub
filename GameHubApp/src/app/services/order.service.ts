import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  getOrders(): Observable<any[]> {
    return this.authService.user$.pipe(
      switchMap(user => 
        this.firestore.collection('orders', ref => ref.where('userId', '==', user?.uid)).valueChanges()
      )
    );
  }
}
