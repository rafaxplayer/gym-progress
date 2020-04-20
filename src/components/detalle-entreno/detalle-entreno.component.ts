import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { DialogsService } from 'src/services/dialogs.service';
import { NavController } from '@ionic/angular';
import { ItemOpacity } from '../../app/app-animations';

@Component({
  selector: 'detalle-entreno',
  templateUrl: './detalle-entreno.component.html',
  animations:ItemOpacity
})
export class DetalleEntrenoComponent implements OnInit {

  @Input() entreno;

  exerciseName:string;

  groupName:string;

  series:any[] = [];

  constructor(private navCtrl: NavController, private database: DatabaseService, private dialogsService: DialogsService) { }

  ngOnInit() {
    this.database.getExerciseWithId(this.entreno.exercise_id).then((exercise) => {
      this.exerciseName = exercise.name;
      this.groupName = exercise.muscle_name;
    });

    this.series = JSON.parse(this.entreno.series);

  }

  editTraining() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        training: JSON.stringify(this.entreno),
        date: this.entreno.date
      }
    };
    this.navCtrl.navigateForward(['entreno'], navigationExtras);
  }

  deleteTraining() {
    this.dialogsService.dialogConfirm('Eliminar entrenamiento', `¿Seguro quieres eliminar el entrenamiento de ${this.groupName}?`, 'No', 'Si')
      .then((res) => {
        if (res === "ok") {
          this.database.deleteData('trainings', this.entreno.id).then(() => {
            this.dialogsService.dialogOk("Ok", "Entrenamiento eliminado!!!", "Cerrar");
          });

        }

      });

  }

  compareTraining() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        training: JSON.stringify(this.entreno),
        date: this.entreno.date
      }
    };
    this.navCtrl.navigateForward(['compare-dates'], navigationExtras);
  }

}
