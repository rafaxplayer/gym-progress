import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';
import { ComponentsModule } from '../../components/components.module';
import { MatExpansionModule, MatButtonModule } from '@angular/material';
import { MatSelectModule, MatIconModule, MatDividerModule } from '@angular/material/';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    ComponentsModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
    
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
