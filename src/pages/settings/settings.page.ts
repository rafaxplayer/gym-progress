import { Component } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  collapseCard:boolean=true;
  
  collapseCard2:boolean=true;
 
  constructor(public event: Events) { }

  ionViewWillEnter() {
    this.event.publish('settingsIsActive', true);
  }

  ionViewWillLeave() {
    this.event.publish('settingsIsActive', false);
  }
      
}
