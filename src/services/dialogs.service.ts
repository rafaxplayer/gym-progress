import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  modal:any;

  constructor(public alertController: AlertController,public modalCtrl:ModalController) { }

  async dialogConfirm(header: any,message: any,cancelText: any,okText: any): Promise<any> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'alertButton',
            handler: (cancel) => {
              resolve('cancel');
              alert.dismiss();
            }
          }, {
            text: okText,
            cssClass: 'alertButton',
            handler: (ok) => {
              resolve('ok');
            }
          }
        ]
      });
      alert.present();
    });
  }

  async dialogOk(header: any,message: any,okText: any): Promise<any> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: okText,
            cssClass: 'alertButton',
            handler: (ok) => {
              resolve('ok');
              alert.dismiss();
            }
          }
        ]
      });
      alert.present();
    });
  }

  async showModal(component:any,props:any){
     this.modal = await this.modalCtrl.create({
        component: component,
        componentProps:props,
        cssClass:'modal-style'
      });
      
      return await this.modal.present();
      
  }

  closeModal(){
    
      this.modalCtrl.dismiss(null,'cancel');
    
  }
}
