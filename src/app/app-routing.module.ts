import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'settings', loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsPageModule) },
  { path: 'entreno', loadChildren: () => import('../pages/entreno/entreno.module').then( m => m.EntrenoPageModule) },
  { path: 'compare-dates', loadChildren: () => import('../pages/compare-dates/compare-dates.module').then( m => m.CompareDatesPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
