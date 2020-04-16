import { DialogsService } from './../../services/dialogs.service';
import { Component, OnInit } from '@angular/core';
import { DatabaseService, Muscle_Group } from '../../services/database.service';
import { ModalController } from '@ionic/angular';
import { NuevoGrupoMuscularComponent } from '../nuevo-grupo-muscular/nuevo-grupo-muscular.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nuevo-ejercicio',
  templateUrl: './nuevo-ejercicio.component.html'
})
export class NuevoEjercicioComponent implements OnInit{

  exerciseName: string = "";

  m_groups: Muscle_Group[] = [];

  m_group_id: number = 0;

  exerciseId: number = 0;

  subscription:Subscription;

  constructor(private database: DatabaseService,private dialogsService:DialogsService) {}

  ngOnInit(){
     this.subscription=this.database.getMuscleGroups().subscribe((m_g: Muscle_Group[]) => {
      this.m_groups = m_g;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
    
  newMuscleGroup() {
    this.dialogsService.showModal(NuevoGrupoMuscularComponent,{})
  }

  newExercise() {

    if (!(this.m_group_id > 0)) {
      this.dialogsService.dialogOk('Error','Selecciona un grupos muscular','Ok');
      return;
    }

    if (this.exerciseName === "") {
      this.dialogsService.dialogOk('Error','introduce un nombre para el ejercicio','Ok');
      return;
    }

    if (this.exerciseId > 0) {
      this.database.updateData("exercises",[this.exerciseName, this.m_group_id, this.exerciseId]).then(() => {
        this.dialogsService.dialogOk('Ok','Ejercicico actualizado!!!','Ok');
        this.resetData();
      }).catch(e => this.dialogsService.dialogOk(":( Ups!!",`Ocurrio un error: ${JSON.stringify(e)}`,"Ok"));
      
    } else {
      this.database.addData('exercises',[this.exerciseName, this.m_group_id]).then(() => {
        this.dialogsService.dialogOk('Ok','Ejercicico guardado!!!','Ok');
        this.resetData();
      }).catch(e => this.dialogsService.dialogOk(":( Ups!!",`Ocurrio un error: es posible que hayas repetido el nombre`,"Ok"))
    }

  }

  resetData() {
    this.m_group_id = 0;
    this.exerciseName = "";
    this.exerciseId = 0;
    this.dialogsService.closeModal()

  }

  onChangeMgroup(event) {
    this.m_group_id = event.value == undefined ? 0 : event.value;
  }

}
