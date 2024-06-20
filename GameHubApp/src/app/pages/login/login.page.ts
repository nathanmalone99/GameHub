import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private navCtrl: NavController) { }

  async login() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      const user = userCredential.user;
      if (user) {
        console.log('Login successful:', user);
        this.navCtrl.navigateForward('/home');
      } else {
        console.error('No user returned from login');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }
}
