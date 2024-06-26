import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLibraryPage } from './user-library.page';

const routes: Routes = [
  {
    path: '',
    component: UserLibraryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserLibraryPageRoutingModule {}
