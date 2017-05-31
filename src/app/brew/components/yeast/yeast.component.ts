import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Yeast } from '../../models-shared/brew.interface';

@Component({
  selector: 'yeast',
  styleUrls: ['yeast.component.scss'],
  templateUrl: './yeast.component.html'
})
export class yeastComponent {
  @Input()
  detail: Yeast;
}
