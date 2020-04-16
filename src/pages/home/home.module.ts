
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { ComponentsModule } from '../../components/components.module';

/* Material */
import { MatIconModule, MatButtonModule, MatListModule, MatDividerModule} from '@angular/material/';
@NgModule({
 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
  ]),
  NgCalendarModule,
  ComponentsModule,
  MatIconModule, 
  MatButtonModule,
  MatListModule,
  MatDividerModule
  ],
  
  declarations: [HomePage]
})
export class HomePageModule {}
