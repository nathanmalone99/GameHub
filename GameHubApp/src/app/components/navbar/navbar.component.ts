import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  user$: Observable<firebase.User | null>;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (!user) {
        this.clearUserData();
      }
    });
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  goToSignupPage() {
    this.router.navigate(['/signup']);
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  goToFavouritesPage() {
    this.router.navigate(['/favourites']);
  }

  goToRecoomendationsPage() {
    this.router.navigate(['/recommendation']);
  }

  goToStoresPage() {
    this.router.navigate(['/storefront']);
  }

  goToOrdersPage() {
    this.router.navigate(['/orders']);
  }

  goToCartPage() {
    this.router.navigate(['/cart']);
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('User has been logged out');
      this.clearUserData();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private clearUserData() {
    localStorage.removeItem('favoriteGames');
  }
}
