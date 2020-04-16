import { Training } from './../../services/database.service';
import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService, Muscle_Group, Exercise} from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogsService } from './../../services/dialogs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compare-dates',
  templateUrl: './compare-dates.page.html'
})
export class CompareDatesPage implements OnInit {

  entreno:Training;

  group_id:number=0;

  exercise_id:number=0;

  entrenos:Training[]=[];

  m_groups:Muscle_Group[]=[];

  exercises:Exercise[]=[];

  subscriptions:Subscription[]=[];

  constructor(private database:DatabaseService,private activatedRoute: ActivatedRoute, private router: Router, private dialogsService: DialogsService) { 

    this.activatedRoute.queryParams.subscribe(params => {
      
      if(params.training){
        this.entreno = JSON.parse(params.training); 
      }
    });
  }

  ngOnInit() {
    if(this.entreno){
      this.database.getTrainingsWithExercise(this.entreno.exercise_id);
    }
  }

  ionViewWillEnter(){
    this.subscriptions.push(this.database.getMuscleGroups().subscribe((mgs:Muscle_Group[])=>{
      this.m_groups = mgs;
    }));
    
    this.subscriptions.push(this.database.getExercises().subscribe((exers:Exercise[])=>{
      this.exercises = exers;
    }));

    this.subscriptions.push(this.database.getTrainings().subscribe((trs:Training[])=>{
      this.entrenos = trs;
    }));
  }

  ionViewDidLeave(): void {
    this.subscriptions.forEach((subs) =>{
      subs.unsubscribe();
    });
  }
    
  onChangeMgroup($event:any){
    this.group_id = $event.value;
    if(this.group_id > 0){
      this.database.loadExercises($event.value);
      if(this.exercise_id > 0){
        this.searchTrainings(this.group_id,this.exercise_id);
      }
    }
  }

  onChangeExercise($event:any){
    this.exercise_id = $event.value;
    this.searchTrainings( this.group_id, this.exercise_id );
  }
  
  searchTrainings(group_id:number,exercise_id:number){
    if(this.exercise_id > 0 && this.group_id > 0){
      this.database.searchTrainingsWithExerciseAndGroup( group_id, exercise_id ).then((trs:Training[])=>{
       this.entrenos = trs;
      });
    }else{
      this.dialogsService.dialogOk('Error','Debes establecer un grupo y un ejercicio','Cerrar');
    }
  }
}
