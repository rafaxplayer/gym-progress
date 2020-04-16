import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntrenoPage } from './entreno.page';
import { CanDeactivateGuard } from 'src/services/can-deactivate-guard.service';

const routes: Routes = [
  {
    path: '',
    component: EntrenoPage,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntrenoPageRoutingModule {}
