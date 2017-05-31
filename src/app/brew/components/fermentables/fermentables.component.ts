import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Malt } from '../../models-shared/brew.interface';

@Component({
  selector: 'fermentables',
  styleUrls: ['fermentables.component.scss'],
  templateUrl: './fermentables.component.html'
})
export class fermentablesComponent {
  @Input()
  detail: Malt;
}
