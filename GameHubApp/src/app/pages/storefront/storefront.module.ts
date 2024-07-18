import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorefrontPageRoutingModule } from './storefront-routing.module';

import { StorefrontPage } from './storefront.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorefrontPageRoutingModule
  ],
  declarations: [StorefrontPage]
})
export class StorefrontPageModule {}
