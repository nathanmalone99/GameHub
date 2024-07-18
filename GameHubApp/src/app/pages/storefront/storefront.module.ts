import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorefrontPageRoutingModule } from './storefront-routing.module';

import { StorefrontPage } from './storefront.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    StorefrontPageRoutingModule
  ],
  declarations: [StorefrontPage]
})
export class StorefrontPageModule {}
