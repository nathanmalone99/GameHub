import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SignupPage } from './signup.page';

import { SignupPageRoutingModule } from './signup-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    SharedModule
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
