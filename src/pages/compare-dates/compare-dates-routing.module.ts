import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompareDatesPage } from './compare-dates.page';

const routes: Routes = [
  {
    path: '',
    component: CompareDatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompareDatesPageRoutingModule {}
