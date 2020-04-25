import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompareDatesPageRoutingModule } from './compare-dates-routing.module';
import { CompareDatesPage } from './compare-dates.page';
import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompareDatesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CompareDatesPage]
})
export class CompareDatesPageModule {}
