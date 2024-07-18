import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorefrontPage } from './storefront.page';

const routes: Routes = [
  {
    path: '',
    component: StorefrontPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorefrontPageRoutingModule {}
