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
 
  series:any[] = [];

  constructor(private navCtrl: NavController, private database: DatabaseService, private dialogsService: DialogsService) { }

  ngOnInit() {
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
    this.dialogsService.dialogConfirm('Eliminar entrenamiento', `¿Seguro quieres eliminar el entrenamiento de ${this.entreno.muscle_name}?`, 'No', 'Si')
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
