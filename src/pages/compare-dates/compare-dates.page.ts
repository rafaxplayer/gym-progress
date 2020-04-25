import { Training } from './../../services/database.service';
import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService, Muscle_Group, Exercise } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogsService } from './../../services/dialogs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compare-dates',
  templateUrl: './compare-dates.page.html'
})
export class CompareDatesPage {

  entreno: Training;

  group_id: number = 0;

  exercise_id: number = 0;

  entrenos: Training[] = [];

  m_groups: Muscle_Group[] = [];

  exercises: Exercise[] = [];

  subscriptions: Subscription[] = [];

  eventsPropagation = 0;

  constructor(private database: DatabaseService, private activatedRoute: ActivatedRoute, private router: Router, private dialogsService: DialogsService) {

    this.activatedRoute.queryParams.subscribe(params => {

      if (params.training) {
        this.entreno = JSON.parse(params.training);
      }
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');

    this.subscriptions.push(this.database.getMuscleGroups().subscribe((mgs: Muscle_Group[]) => {
      this.m_groups = mgs;
    }));

    this.subscriptions.push(this.database.getExercises().subscribe((exers: Exercise[]) => {
      this.exercises = exers;
    }));

    this.subscriptions.push(this.database.getTrainings().subscribe((trs: Training[]) => {
      this.entrenos = trs;
    }));

    if (this.entreno) {

      this.eventsPropagation = 0;
      this.group_id = this.entreno.muscle_group_id
      this.exercise_id = this.entreno.exercise_id
      this.searchTrainings(this.group_id, this.exercise_id);

    }
  }

  ionViewDidLeave(): void {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    });

  }

  onChangeMgroup($event: any) {

    if (this.eventsPropagation > 0) {
      if ($event.detail.value != undefined) {
        this.group_id = $event.detail.value;
        this.database.loadExercises(this.group_id);
        this.searchTrainings(this.group_id, this.exercise_id);
      }
    }

  }

  onChangeExercise($event: any) {
    if (this.eventsPropagation > 0) {
      if ($event.detail.value != undefined) {
        this.exercise_id = $event.detail.value;
        this.searchTrainings(this.group_id, this.exercise_id);
      }
    }
    this.eventsPropagation = 1;
  }

  searchTrainings(group_id: number, exercise_id: number) {
    if (group_id > 0 && exercise_id > 0) {
      this.database.searchTrainingsWithExerciseAndGroup(group_id, exercise_id).then((trs: Training[]) => {
        this.entrenos = trs;
      });
    } else {
      this.dialogsService.dialogOk('Error', 'Debes establecer un grupo y un ejercicio', 'Cerrar');
    }
  }
}
