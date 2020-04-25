import { Component, OnInit } from '@angular/core';
import { Training, Muscle_Group, Exercise } from 'src/services/database.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { DialogsService } from 'src/services/dialogs.service';
import { UtilsService } from 'src/services/utils.service';
import { NavigationExtras } from '@angular/router';
import { NavController, ActionSheetController } from '@ionic/angular';
import { DetalleEntrenoComponent } from '../detalle-entreno/detalle-entreno.component';

@Component({
  selector: 'entrenos',
  templateUrl: './entrenos.component.html',
  styleUrls: ['./entrenos.component.scss']
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

  constructor(private actionSheetContrl: ActionSheetController, private database: DatabaseService, private dialogsService: DialogsService, private navCtrl: NavController, private utils: UtilsService) { }

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
    if($event.detail.value != undefined){
      this.group_id = $event.detail.value;
      this.database.loadExercises(this.group_id);
      this.searchTrainings(this.group_id, this.exercise_id);
    }
    
  }

  onChangeExercise($event: any) {
    if($event.detail.value != undefined){
      this.exercise_id = $event.detail.value;
      this.searchTrainings(this.group_id, this.exercise_id);
    }
  }

  onChangeInitDate($event) {
    if ($event.detail.value != undefined) {
      this.initDate = this.utils.formatYMD(new Date($event.detail.value));
    }
  }

  onChangeEndDate($event) {
    if ($event.detail.value != undefined) {
      this.endDate = this.utils.formatYMD(new Date($event.detail.value));
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
    }).catch(err=> console.log('catch',err));
  }

  async goActions(entreno: Training) {
    const actionSheet = await this.actionSheetContrl.create({
      header: `Acciones para el entreno`,
      cssClass: 'action-shett-custom-css',
      backdropDismiss:true,
      translucent:true,
      buttons: [
        {
          text: 'Visualizar',
          icon: 'eye',
          handler: () => {
            this.dialogsService.showModal(DetalleEntrenoComponent,{entreno:entreno})
          }
        }, {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                training: JSON.stringify(entreno),
                date: entreno.date
              }
            };
            this.navCtrl.navigateForward(['entreno'], navigationExtras);
          }
        }, {
          text: 'Eliminar',
          icon: 'trash',
          handler: () => {
            this.dialogsService.dialogConfirm(`Eliminar entreno`, `¿Seguro quieres eliminar el entreno selecionado?`, 'NO', 'SI').then(res => {
              if (res === 'ok') {
                this.database.deleteData('trainings', entreno.id).then(() => {
                  this.dialogsService.dialogOk('Ok', 'Entreno elimnado con exito!!!', 'Cerrar');
                });

              }
            });
          }
        }]
    });
    await actionSheet.present();
  }

  deleteAll() {
    if (this.entrenos.length > 0) {
      this.dialogsService.dialogConfirm("Eliminar Entrenos", "¿Seguro quieres elimnar esos entrenos?", "Cancelar", "Si")
        .then(() => {
          this.entrenos.forEach(tr => {
            this.database.deleteData('trainings', tr.id).then(() => console.log(`Entreno eliminado con id : ${tr.id}`))
          });
        })
    }
  }

}
