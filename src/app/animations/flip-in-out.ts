import { trigger, state, style, animate, transition } from '@angular/animations';

export const flipInOut = trigger('flipInOut', [
  state('in', style({transform: 'translateX(0) rotateY(0deg) scale(1)'})),
  transition(':enter', [
    style({transform: 'translateX(128%) rotateY(-90deg) scale(1.3)'}),
    animate('0.49s cubic-bezier(0,0,.12,1)')
  ]),
  transition(':leave', [
    animate('0.35s ease-in', style({transform: 'translateX(128%) rotateY(-90deg) scale(1.3)'}))
  ])
]);
