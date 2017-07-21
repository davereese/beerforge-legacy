import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Malt } from '../../models/brew.interface';

@Component({
  selector: 'fermentable',
  styleUrls: ['fermentable.component.scss'],
  templateUrl: './fermentable.component.html'
})
export class fermentableComponent {
  @Input()
  malt: Malt;

  @Input()
  amount: number;
}
