import { Component, Input } from '@angular/core';

import { Hop } from '../../models/brew.interface';

@Component({
  selector: 'hop',
  styleUrls: ['hop.component.scss'],
  templateUrl: './hop.component.html'
})
export class hopComponent {
  @Input()
  hop: Hop;

  @Input()
  index: number;

  @Input()
  amount: number;

  @Input()
  alphaAcid: number;

  @Input()
  time: number;

  @Input()
  hopIBUs: any;
}
