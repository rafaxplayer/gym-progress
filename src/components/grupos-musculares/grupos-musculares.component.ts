import { Component, OnInit} from '@angular/core';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { DatabaseService, Muscle_Group } from '../../services/database.service';
import { NuevoGrupoMuscularComponent } from '../nuevo-grupo-muscular/nuevo-grupo-muscular.component';
import { DialogsService } from 'src/services/dialogs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'grupos-musculares',
  templateUrl: './grupos-musculares.component.html'
})
export class GruposMuscularesComponent implements OnInit{

  muscle_g:Muscle_Group[] = [];

  subscription:Subscription;

  constructor(private database: DatabaseService,private dialogsService:DialogsService, private dialogService:DialogsService, public actionSheetContrl: ActionSheetController) { }


  ngOnInit() {
    this.subscription = this.database.getMuscleGroups().subscribe((m_groups:Muscle_Group[]) => {
      this.muscle_g = m_groups;
    });

  }
  
  ngOnDestroy(){
    
    this.subscription.unsubscribe();
  }

  async goActions(group:Muscle_Group) {
    const actionSheet = await this.actionSheetContrl.create({
      header: `Acciones para "${group.name}"`,
      cssClass:"action-shett-custom-css",
      buttons: [{
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.dialogService.dialogConfirm(`Eliminar ${group.name}`,`¿Seguro quieres eliminar ${group.name}`,'Cancelar','Ok').then( res =>{
            if(res === 'ok'){
              this.database.deleteData('muscle_groups',group.id).then(()=>{
                this.dialogService.dialogOk('Ok','Grupo elimnado con exito!!!','Cerrar');
               });
            }
          });
        }
      }, {
        text: 'Editar',
        icon: 'create',
        handler: () => {
          this.showModal(group);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          actionSheet.dismiss();
        }
      }]
    });
    await actionSheet.present();
  }

  showModal(group:Muscle_Group) {
    const props={
      groupName:group.name,
      groupId:group.id,
      groupImg:group.img}
    this.dialogsService.showModal(NuevoGrupoMuscularComponent,props);
  }

 
}
