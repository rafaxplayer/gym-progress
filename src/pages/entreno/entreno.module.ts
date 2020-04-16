import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntrenoPageRoutingModule } from './entreno-routing.module';

import { EntrenoPage } from './entreno.page';
import { ComponentsModule } from 'src/components/components.module';

/* Material */
import { MatIconModule, MatButtonModule, MatSelectModule, MatDividerModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material/';
import { CanDeactivateGuard } from 'src/services/can-deactivate-guard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntrenoPageRoutingModule,
    ComponentsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [EntrenoPage],
  providers: [CanDeactivateGuard]
})
export class EntrenoPageModule {}
