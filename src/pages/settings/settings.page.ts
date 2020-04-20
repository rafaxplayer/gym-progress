import { Component } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  collapseCard1:boolean=false;
  
  collapseCard2:boolean=false;

  collapseCard3:boolean=false;
 
  constructor(public event: Events) { }

  ionViewWillEnter() {
    this.event.publish('settingsIsActive', true);
  }

  ionViewWillLeave() {
    this.event.publish('settingsIsActive', false);
  }
      
}
