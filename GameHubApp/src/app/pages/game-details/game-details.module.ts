import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameDetailsPageRoutingModule } from './game-details-routing.module';

import { GameDetailsPage } from './game-details.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GameDetailsPageRoutingModule
  ],
  declarations: [GameDetailsPage]
})
export class GameDetailsPageModule {}
