import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  constructor(private router: Router) {}

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

  goToCartPage() {
    this.router.navigate(['/cart']);
  }
}
