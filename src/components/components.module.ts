import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { NuevoEjercicioComponent } from './nuevo-ejercicio/nuevo-ejercicio.component';
import { FormsModule } from '@angular/forms';
import { NuevoGrupoMuscularComponent } from './nuevo-grupo-muscular/nuevo-grupo-muscular.component';
import { GruposMuscularesComponent } from './grupos-musculares/grupos-musculares.component';
import { DetalleEntrenoComponent } from './detalle-entreno/detalle-entreno.component';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { EntrenosComponent } from './entrenos/entrenos.component';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

/* Material */
import { MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatListModule, MatSelectModule, MatDatepickerModule,
  MatNativeDateModule} from '@angular/material/';

@NgModule({
  declarations: [
    HeaderComponent,
    NuevoEjercicioComponent,
    NuevoGrupoMuscularComponent,
    GruposMuscularesComponent,
    DetalleEntrenoComponent,
    EjerciciosComponent,
    EntrenosComponent
  ],
  imports: [
    CommonModule,
    IonicModule ,
    FormsModule,
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents:[NuevoGrupoMuscularComponent, NuevoEjercicioComponent, EntrenosComponent],
  exports: [
    HeaderComponent,
    NuevoEjercicioComponent,
    NuevoGrupoMuscularComponent,
    GruposMuscularesComponent,
    DetalleEntrenoComponent,
    EjerciciosComponent,
    EntrenosComponent
  ],
  providers:[ImagePicker]
})
export class ComponentsModule { }
