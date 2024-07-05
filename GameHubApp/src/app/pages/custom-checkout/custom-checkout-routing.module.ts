import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomCheckoutPage } from './custom-checkout.page';

const routes: Routes = [
  {
    path: '',
    component: CustomCheckoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomCheckoutPageRoutingModule {}
