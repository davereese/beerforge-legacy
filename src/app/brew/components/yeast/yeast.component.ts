import { Component, Input} from '@angular/core';

import { Yeast } from '../../models/brew.interface';

@Component({
  selector: 'yeast',
  styleUrls: ['yeast.component.scss'],
  templateUrl: './yeast.component.html'
})
export class yeastComponent {
  @Input()
  yeast: Yeast;

  @Input()
  amount: number;

  @Input()
  package: string;
}
