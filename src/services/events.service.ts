import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })

    export class EventsService {

       private refreshData$ = new Subject();

       constructor() {
         this.refreshData$.asObservable();
       }

       refresh(bool:Boolean){
         this.refreshData$.next(bool)
       }
    }
