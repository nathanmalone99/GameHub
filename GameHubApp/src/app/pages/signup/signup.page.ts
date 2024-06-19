import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private navCtrl: NavController) { }

  async signup() {
    try {
      const user = await this.authService.register(this.email, this.password);
      console.log('Signup successful:', user);
      this.navCtrl.navigateForward('/home');  // Navigate to home or any other page after successful signup
    } catch (error) {
      console.error('Signup error:', error);
    }
  }
}