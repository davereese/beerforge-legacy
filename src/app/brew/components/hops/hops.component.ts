import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Hop } from '../../models-shared/brew.interface';

@Component({
  selector: 'hops',
  styleUrls: ['hops.component.scss'],
  templateUrl: './hops.component.html'
})
export class hopsComponent {
  @Input()
  detail: Hop;
  @Input()
  index: number;
  @Input()
  hopIBUs: any;
}
