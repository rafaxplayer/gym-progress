import { Injectable, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public formatYMD(d:Date) {  
    function pad(n:number) {return (n<10? '0' :  '') + n}
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  public scrollToElement(content:IonContent,element: ElementRef): void {
    let yOffset = element.nativeElement.getBoundingClientRect().top;
    setTimeout(() => {
      content.scrollToPoint(0, yOffset, 2000);
    }, 500)
    
  }

  public scrollToTop(content:IonContent,mil:number): void {
    content.scrollToTop(mil);
  }

  public scrollToBottom(content:IonContent,mil:number): void {
    content.scrollToBottom(mil);
  }

}
