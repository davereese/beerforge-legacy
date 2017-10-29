import { trigger, state, style, animate, transition } from '@angular/animations';

export const modalPop = trigger('modalPop', [
  state('in', style({transform: 'translate(-50%, -50%)', opacity: '1'})),
  transition(':enter', [
    style({transform: 'translate(-50%, -20%)', opacity: '0'}),
    animate('0.5s cubic-bezier(.54,0,.03,1)')
  ]),
  transition(':leave', [
    style({transform: 'translate(-50%, -50%)'}),
    animate('0.3s cubic-bezier(.54,0,.03,1)', style({transform: 'translate(-50%, -80%)', opacity: '0'}))
  ])
]);
