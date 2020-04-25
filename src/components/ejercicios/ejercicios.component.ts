import { Component, OnInit } from '@angular/core';
import { DatabaseService, Exercise, Muscle_Group } from '../../services/database.service';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { NuevoEjercicioComponent } from '../nuevo-ejercicio/nuevo-ejercicio.component';
import { DialogsService } from 'src/services/dialogs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ejercicios',
  templateUrl: './ejercicios.component.html'
})
export class EjerciciosComponent implements OnInit{
  
  exercises:Exercise[]=[];

  exercisesGroups:any[]=[];

  m_groups:Muscle_Group[]=[];

  subscriptions:Subscription[]=[];

  constructor(private database:DatabaseService,private dialogsService:DialogsService, private dialogService:DialogsService,public actionSheetContrl: ActionSheetController) { }

  ngOnInit(){
    
    this.database.loadExercises();
    
    this.subscriptions.push(this.database.getExercises().subscribe((ex: Exercise[]) => {
      this.exercises = ex;
    }));

    this.subscriptions.push(this.database.getMuscleGroups().subscribe((m_g: Muscle_Group[]) => {
      this.m_groups = m_g;
    }));
    
  }

  ngOnDestroy(){
    
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe();
    });
  }

  onChangeMgroup(event) {
    let muscle_group_id = event.detail.value == undefined ? 0 : event.detail.value;
      if (muscle_group_id > 0){
        this.database.loadExercises(muscle_group_id);
      }else{
        this.database.loadExercises();
      }
          
  }
  
  async goActions(ex: Exercise){
    const actionSheet = await this.actionSheetContrl.create({
      header: `Acciones para "${ex.name}"`,
      cssClass:'action-shett-custom-css',
      backdropDismiss:true,
    
      buttons: [{
        text: 'Eliminar',
        icon: 'trash',
        handler: () => {
          this.dialogService.dialogConfirm(`Eliminar ${ex.name}`,`¿Seguro quieres eliminar ${ex.name}?`,'Cancelar','Ok').then( res =>{
            if(res === 'ok'){
              this.database.deleteData('exercises',ex.id).then(()=>{
                this.dialogService.dialogOk('Ok','Ejercicio elimnado con exito!!!','Cerrar');
               });
              
            }
          });
        }
      }, {
        text: 'Editar',
        icon: 'create',
        handler: () => {
          this.showModal(ex);
          
        }
      }]
    });
    await actionSheet.present();
  }

  showModal(ex:Exercise) {
    const props = { exerciseId:ex.id, exerciseName:ex.name, m_group_id:ex.muscle_group_id }
    this.dialogsService.showModal(NuevoEjercicioComponent,props);
  }
}
