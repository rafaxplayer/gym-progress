import { Component, OnInit } from '@angular/core';
import { NavController,Events } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  showButtonSettings:Boolean = true

  constructor(private navCtrl:NavController,public event: Events) { 
    this.event.subscribe('settingsIsActive',( isactive )=>{
      this.showButtonSettings = !isactive;
    })
  }
    
  goSettings(){
    this.navCtrl.navigateForward('settings');
  }

  goRoot(){
    this.navCtrl.navigateRoot('home');
  }

  ionViewWillLeave(){
    this.event.unsubscribe('settingsIsActive');
  }
}
