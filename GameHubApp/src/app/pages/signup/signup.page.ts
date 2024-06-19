import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {

  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private navCtrl: NavController) { }

  async signup() {
    try {
      const userCredential = await this.authService.register(this.email, this.password);
      const user = userCredential.user;
      if (user) {
        console.log('Signup successful:', user);
        await this.authService.updateUserProfile(user, this.username, this.firstName, this.lastName);
        this.navCtrl.navigateForward('/home');  // Navigate to home after successful signup
      } else {
        console.error('No user returned from signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  }
}