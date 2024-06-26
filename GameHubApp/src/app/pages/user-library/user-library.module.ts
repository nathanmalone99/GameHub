import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserLibraryPageRoutingModule } from './user-library-routing.module';

import { UserLibraryPage } from './user-library.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserLibraryPageRoutingModule
  ],
  declarations: [UserLibraryPage]
})
export class UserLibraryPageModule {}
