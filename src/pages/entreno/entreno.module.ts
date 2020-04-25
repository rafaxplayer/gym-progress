import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntrenoPageRoutingModule } from './entreno-routing.module';

import { EntrenoPage } from './entreno.page';
import { ComponentsModule } from 'src/components/components.module';
import { CanDeactivateGuard } from 'src/services/can-deactivate-guard.service';
import {HideButtonDirective} from '../../directives/hide-button.directive'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntrenoPageRoutingModule,
    ComponentsModule,
    
  ],
  declarations: [EntrenoPage,HideButtonDirective],
  providers: [CanDeactivateGuard]
})
export class EntrenoPageModule {}
