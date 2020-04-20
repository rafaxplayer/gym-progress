import { Training } from './../../services/database.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavController, IonContent, Platform } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { DatabaseService } from 'src/services/database.service';
import { Subscription } from 'rxjs';
import { CalendarComponent } from "ionic2-calendar/calendar";
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  @ViewChild('content', { static: false }) content: IonContent;

  @ViewChild(CalendarComponent, null) myCalendar: CalendarComponent;

  buttonUp: any;

  isToday: boolean;

  currentDate: Date = new Date();

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'es'
  };

  calendarTitle: string;

  entrenosEvent: any[] = [];

  entrenos: Training[] = [];

  subscriptionbackButton: Subscription;

  subscriptionTraining: Subscription;

  constructor(private platform: Platform, private navCtrl: NavController, private element: ElementRef, private renderer: Renderer2, private database: DatabaseService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.subscriptionTraining = this.database.getTrainings().subscribe((trs: Training[]) => {
      this.entrenos = trs;
      this.loadEvents();
    });
    this.isToday = this.isDateToday(this.calendar.currentDate)
  }

  ngOnDestroy(): void {
    this.subscriptionTraining.unsubscribe();
  }

  ionViewDidEnter(): void {
    this.database.loadTrainings(this.utilsService.formatYMD(this.currentDate));
    this.subscriptionbackButton = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillLeave(): void {
    this.subscriptionbackButton.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.buttonUp = this.element.nativeElement.getElementsByClassName("arrou-up-button")[0];
  }

  logScrolling($event: any) {

    if ($event.detail.scrollTop > 700) {
      this.renderer.addClass(this.buttonUp, "show");
    }
    if ($event.detail.scrollTop < 700) {
      this.renderer.removeClass(this.buttonUp, "show");
    }

  }

  scrollToElement(element: string): void {
    if (this.entrenos.length > 0) {
      let yOffset = document.getElementById(element).offsetTop;
      setTimeout(() => {
        this.content.scrollToPoint(0, yOffset, 2000);
      }, 500)
    }
  }

  scrollToTop(): void {
    this.content.scrollToTop(600);
  }

  newTraining() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        training: null,
        date: this.utilsService.formatYMD(this.currentDate)
      }
    };

    this.navCtrl.navigateForward(['entreno'], navigationExtras);

  }

  onViewTitleChanged(title: any) {
    this.calendarTitle = title;
  }

  onCurrentDateChanged($event: Date) {
    this.currentDate = $event;
    this.database.loadTrainings(this.utilsService.formatYMD($event));
    this.scrollToElement("entrenos-content");
    this.isToday = this.isDateToday($event)

  };

  isDateToday(date: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return today.getTime() === date.getTime();
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  loadEvents() {
    this.database.getAllDates().then((dates: any[]) => {
      if (dates.length > 0) {

        this.entrenosEvent.splice(0, this.entrenosEvent.length)

        dates.forEach((dat: any) => {
          let trDate = new Date(dat.date);
          this.entrenosEvent.push({
            title: "Entreno :" + dat.date,
            startTime: new Date(Date.UTC(trDate.getUTCFullYear(), trDate.getUTCMonth(), trDate.getUTCDate())),
            endTime: new Date(Date.UTC(trDate.getUTCFullYear(), trDate.getUTCMonth(), trDate.getUTCDate() + 1)),
            allDay: true
          });

        });
        this.myCalendar.loadEvents();
      }
    });
  }

}
