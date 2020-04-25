import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { DialogsService } from 'src/services/dialogs.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'nuevo-grupo-muscular',
  templateUrl: './nuevo-grupo-muscular.component.html'
})
export class NuevoGrupoMuscularComponent {
 
  groupId: number = 0;

  groupName: string = "";

  groupImg: string = "assets/muscle-img/muscle_placeholder.png";


  constructor(private database: DatabaseService, private dialogsService: DialogsService, private imgPicker: ImagePicker) { }

  saveGroup() {

    if (this.groupName === "") {
      this.dialogsService.dialogOk('Error', 'Establece un nombre para el grupo', 'Ok');
      return;
    }

    if (this.groupId > 0) {

      this.database.updateData("muscle_groups", [this.groupName, this.groupImg, this.groupId]).then(() => {
        this.dialogsService.dialogOk('Ok', 'Actualizado !!!', 'Ok');
        this.resetData();
        this.dialogsService.closeModal();
      }).catch(e => this.dialogsService.dialogOk(":( Ups!!", `Ocurrio un error:  ${JSON.stringify(e)}`, "Ok"))

    } else {
      this.database.addData("muscle_groups", [this.groupName, this.groupImg]).then(() => {
        this.dialogsService.dialogOk('Ok', 'Guardado !!!', 'Ok');
        this.resetData();
      }).catch(e => this.dialogsService.dialogOk(":( Ups!!", `Ocurrio un error: es posible que hayas repetido el nombre`, "Ok"))
    }
  }
  newImage() {
    var options = {
      quality: 50,
      outputType: 1
    };

    this.imgPicker.getPictures(options).then((results) => {
      this.groupImg = 'data:image/jpeg;base64,' + results[0]
    }, (err) => console.log(err));
  }

  resetData() {
    this.groupName = "";
    this.groupId = 0;
    this.groupImg = "assets/muscle-img/muscle_placeholder.png";
  }

}
