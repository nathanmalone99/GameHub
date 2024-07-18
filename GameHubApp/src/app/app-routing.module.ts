import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'signup', loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'favourites', loadChildren: () => import('./pages/favourites/favourites.module').then(m => m.FavouritesPageModule) },
  { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule) },
  {
    path: 'game-details/:id',
    loadChildren: () => import('./pages/game-details/game-details.module').then( m => m.GameDetailsPageModule)
  },
  {
    path: 'achievements/:id',
    loadChildren: () => import('./pages/achievements/achievements.module').then( m => m.AchievementsPageModule)
  },
  /* {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then( m => m.CheckoutPageModule)
  }, */
  {
    path: 'success',
    loadChildren: () => import('./pages/success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'cancel',
    loadChildren: () => import('./pages/cancel/cancel.module').then( m => m.CancelPageModule)
  },
  /* {
    path: 'custom-checkout',
    loadChildren: () => import('./pages/custom-checkout/custom-checkout.module').then( m => m.CustomCheckoutPageModule)
  }, */
  {
    path: 'recommendation',
    loadChildren: () => import('./pages/recommendation/recommendation.module').then( m => m.RecommendationPageModule)
  },
  {
    path: 'storefront',
    loadChildren: () => import('./pages/storefront/storefront.module').then( m => m.StorefrontPageModule)
  },  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  }


  /* {
    path: 'user-library',
    loadChildren: () => import('./pages/user-library/user-library.module').then( m => m.UserLibraryPageModule)
  }, */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
