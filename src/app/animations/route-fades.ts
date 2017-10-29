import { transition, trigger, query, style, animate, group } from '@angular/animations';

export const routeFades = trigger('routeFades', [
  transition('* <=> *', [
    group([
      query(':enter', [
        style({opacity: '0'}),
        animate('0.5s 0.8s cubic-bezier(.54,0,.03,1)', style({opacity: '1'}))
      ], { optional: true }),
      query(':leave', [
        style({opacity: '1', position: 'absolute', top: '0', left: '0', right: '0'}),
        animate('0.5s cubic-bezier(.54,0,.03,1)', style({opacity: '0', position: 'absolute', top: '0', left: '0', right: '0'}))
      ], { optional: true }),
    ])
  ])
]);
