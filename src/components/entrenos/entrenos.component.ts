import { Component, OnInit } from '@angular/core';
import { Training, Muscle_Group, Exercise } from 'src/services/database.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { DialogsService } from 'src/services/dialogs.service';
import { UtilsService } from 'src/services/utils.service';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'entrenos',
  templateUrl: './entrenos.component.html'

})
export class EntrenosComponent implements OnInit {

  group_id: number = 0;

  exercise_id: number = 0;

  entrenos: Training[] = [];

  m_groups: Muscle_Group[] = [];

  exercises: Exercise[] = [];

  initDate: any;

  endDate: any;

  subscriptions: Subscription[] = [];

  constructor(private database: DatabaseService, private dialogsService: DialogsService, private navCtrl: NavController, private utils: UtilsService) {}

  ngOnInit() {
    this.subscriptions.push(this.database.getMuscleGroups().subscribe((mgs: Muscle_Group[]) => {
      this.m_groups = mgs;
    }));

    this.subscriptions.push(this.database.getExercises().subscribe((exers: Exercise[]) => {
      this.exercises = exers;
    }));

    this.subscriptions.push(this.database.getTrainings().subscribe((trs: Training[]) => {
      this.entrenos = trs;
    }));

    if (this.group_id > 0 && this.exercise_id > 0) {
      this.searchTrainings(this.group_id, this.exercise_id);
    }

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    });
  }

  onChangeMgroup($event: any) {
    this.group_id = $event.value;
    if (this.group_id > 0) {
      this.database.loadExercises($event.value);
      if (this.exercise_id > 0) {
        this.searchTrainings(this.group_id, this.exercise_id);
      }
    }
  }

  onChangeExercise($event: any) {
    this.exercise_id = $event.value;
    if (this.exercise_id > 0 && this.group_id > 0) {
      this.searchTrainings(this.group_id, this.exercise_id);
    } else {
      this.dialogsService.dialogOk('Error', 'Debes establecer un grupo y un ejercicio', 'Cerrar');
    }

  }

  onChangeInitDate($event) {
    if ($event.value != undefined) {
      this.initDate = this.utils.formatYMD(new Date($event.value));
    }
  }

  onChangeEndDate($event) {
    if ($event.value != undefined) {
      this.endDate = this.utils.formatYMD(new Date($event.value));
      this.searchTraininsWithDates(this.initDate, this.endDate);
    }
  }

  newTraining() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        training: null,
        date: new Date().toISOString()
      }
    };

    this.navCtrl.navigateForward(['entreno'], navigationExtras);

  }

  searchTraininsWithDates(initDate: any, endDate: any) {
    if (initDate && endDate) {
      this.database.searchTrainingsWithDateRange(this.initDate, this.endDate).then((trs: Training[]) => {
        this.entrenos = trs;
      });
    } else {
      this.dialogsService.dialogOk('Error', 'Debes establecer fecha de inicio y final', 'Cerrar');
    }
  }

  searchTrainings(group_id: number, exercise_id: number) {

    this.database.searchTrainingsWithExerciseAndGroup(group_id, exercise_id).then((trs: Training[]) => {
      this.entrenos = trs;
    });

  }

}
