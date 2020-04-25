import { Directive , ElementRef, Renderer2, Input} from '@angular/core';

@Directive({
  selector: '[appHideButton]',
  host:{'(ionScroll)': 'handleScroll($event)'}
})
export class HideButtonDirective {

  @Input('appHideButton') clsName:String;

  fabRef:any;

  private storedScroll: number = 0;
  
  private threshold: number = 2;

  constructor(public element: ElementRef, public renderer: Renderer2) {}

  ngOnInit(): void {
    this.fabRef = this.element.nativeElement.getElementsByClassName(this.clsName)[0];
    this.renderer.setStyle(this.fabRef,'bottom','-100px')
    
  }

  handleScroll(event){

    if (event.detail.scrollTop - this.storedScroll > this.threshold) {
      
      this.renderer.setStyle(this.fabRef,'bottom','-100px')
      this.renderer.setStyle(this.fabRef,'transform','scale3d(.1,.1,.1)');
    } else if (event.detail.scrollTop - this.storedScroll < 0) {
      
      this.renderer.setStyle(this.fabRef,'bottom','5%')
      this.renderer.setStyle(this.fabRef,'transform','scale3d(1,1,1)');
    }
    
    this.storedScroll = event.detail.scrollTop;  
  }

}
