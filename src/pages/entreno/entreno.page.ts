import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService, Muscle_Group, Exercise } from 'src/services/database.service';
import { IonContent, ModalController} from '@ionic/angular';
import { DialogsService } from 'src/services/dialogs.service';
import { NuevoEjercicioComponent } from '../../components/nuevo-ejercicio/nuevo-ejercicio.component';
import { NuevoGrupoMuscularComponent } from './../../components/nuevo-grupo-muscular/nuevo-grupo-muscular.component';
import { Subscription } from 'rxjs';
import { IDeactivatableComponent } from 'src/services/can-deactivate-guard.service';
import { EntrenosComponent } from 'src/components/entrenos/entrenos.component';
import { UtilsService } from '../../services/utils.service';
import { log } from 'util';

@Component({
  selector: 'entreno',
  templateUrl: './entreno.page.html',
  styleUrls: ['./entreno.page.scss'],
})
export class EntrenoPage implements OnInit, IDeactivatableComponent{

  @ViewChild('content', { static: false }) content: IonContent;
  
  training = {
    id: 0,
    date: this.utils.formatYMD(new Date()),
    muscle_group_id: 0,
    exercise_id: 0,
    series: [],
    comment:""
  }

  editData:boolean=false;

  m_groups: Muscle_Group[] = []

  exercises: Exercise[] = [];

  subscriptionGroups:Subscription;
  subscriptionExercises:Subscription;

  pickerOptions: any = {
    mode: "md",
  };

  constructor(public modalCtrl:ModalController,private Router:Router, private activatedRoute: ActivatedRoute, private database: DatabaseService, private dialogsService:DialogsService, private utils:UtilsService) {}
/* Implenetacion del servicio para prevenir salir sin guardar cambios*/
  async canDeactivate() {
    
    let canDeactivate = true;

    if (this.editData) {
     await this.dialogsService.dialogConfirm('Guardar cambios','Hay cambios en tu entreno ¿Seguro quieres salir sin guardar?','No','Si').then((res)=>{
        canDeactivate = (res ==='ok');
      }); 
    }
    return canDeactivate;
  }

  ngOnInit(): void {
    this.editData = false;
    console.log(this.training)
  }
  
  ionViewWillEnter(){
    console.log("ionViweWillEnter")
    this.subscriptionGroups = this.database.getMuscleGroups().subscribe((m_g: Muscle_Group[]) => {
      this.m_groups = m_g;
      console.log("Change M Groups",JSON.stringify(this.m_groups))
      this.training.muscle_group_id = this.m_groups.length> 0 ? this.m_groups[0].id:0
    });

    this.subscriptionExercises = this.database.getExercises().subscribe((ex: Exercise[]) => {
      this.exercises = ex;
      console.log("Change Exercises",JSON.stringify(this.exercises))
     
      this.training.exercise_id = this.exercises.length > 0 ?this.exercises[0].id:0
    });

    this.activatedRoute.queryParams.subscribe(params => {
         
      this.training.date = params.date;

      if(params.training){
        let trn = JSON.parse(params.training);
        this.training.id = trn.id;
        this.training.date = trn.date;
        this.training.exercise_id = trn.exercise_id;
        this.training.muscle_group_id = trn.muscle_group_id;
        this.training.series = JSON.parse(trn.series);
        this.training.comment = trn.comment;

      }
   
  });

  }

  ionViewDidLeave(){
    this.subscriptionGroups.unsubscribe()
    this.subscriptionExercises.unsubscribe()
    this.resetData();
  }

  scrollToBottom(): void {
    this.content.scrollToBottom(300);
  }

  onChangeDate(event:any){
    if(event.detail.value != undefined){
      this.training.date = this.utils.formatYMD(new Date(event.detail.value));
    } 
  }

  onChangeMgroup(event) {
    console.log("On Select Change G:",event)
    this.training.muscle_group_id = event.detail.value == undefined ? 0 : event.detail.value;
    if (this.training.muscle_group_id > 0){
      this.database.loadExercises(this.training.muscle_group_id);
    }
    this.editData = true;
  }
  
  onChangeExercise(event) {
    console.log("On Select Change E:",event)
    this.training.exercise_id = event.detail.value == undefined ? 0 : event.detail.value;
    this.editData = true;
  }

  newSerie() {
    this.training.series.push({ kgs: 0, reps: 0 });
    this.scrollToBottom();
    this.editData = true;
  }

  removeSerie(idx) {
    this.training.series.splice(idx, 1);
  }

  newMuscleGroup(){
    this.dialogsService.showModal(NuevoGrupoMuscularComponent,{});
  }
  
  async newExercise(){
   
    let props = {};

    if (this.training.muscle_group_id > 0){
        props = { exerciseId: 0, exerciseName: "", m_group_id: this.training.muscle_group_id };
    }

    const modal = await this.modalCtrl.create({
      component: NuevoEjercicioComponent,
      cssClass: 'modal-style',
      componentProps: props
    });
    modal.onDidDismiss().then((data)=>{
      if (this.training.muscle_group_id > 0){
        this.database.loadExercises(this.training.muscle_group_id);
      }
    })
    
    return await modal.present();
       
  }

  searchTraining(){
    this.dialogsService.showModal(EntrenosComponent,{ group_id:this.training.muscle_group_id, exercise_id:this.training.exercise_id});
  }
  
  saveTraining() {

    if (this.training.muscle_group_id === 0) {
      this.dialogsService.dialogOk('Error','Seleciona un grupo muscular','Ok');
      return;
    }

    if (this.training.exercise_id === 0) {
      this.dialogsService.dialogOk('Error','Seleciona ejercicio','Ok');
      return;
    }

    if (!(this.training.series.length > 0)) {
      this.dialogsService.dialogOk('Error','Añade alguna serie a tu Entreno','Ok');
      return;
    }

    if (this.training.id > 0) {
      this.database.updateData("trainings",[this.training.date, this.training.muscle_group_id, this.training.exercise_id, JSON.stringify(this.training.series),this.training.comment, this.training.id],this.training.date).then(() => {
        this.dialogsService.dialogOk('Ok','Entrenamiento actualizado!!!','Ok');
        this.editData = false;
      });
      
    } else {
      this.database.addData("trainings",[this.training.date, this.training.muscle_group_id, this.training.exercise_id, JSON.stringify(this.training.series),this.training.comment], this.training.date)
        .then((data) => {
          this.dialogsService.dialogOk('Ok','Entrenamiento guardado!!!','Ok');
          this.resetData();
        });
    }
  }

  resetData(){
    this.training = {
      id: 0,
      date: this.utils.formatYMD(new Date()),
      muscle_group_id: 0,
      exercise_id: 0,
      series: [],
      comment:""
    }
    this.editData = false;
  }
  
}
