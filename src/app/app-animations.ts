import { trigger, transition, animate, style, animation, } from '@angular/animations';

export const ItemOpacity = [
    trigger('animacionItem',
    [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('1000ms', style({ opacity: 1 })),
          ]),
        transition(':leave', [
            animate('1000ms', style({ opacity: 0 }))
          ])
    ])
  ];