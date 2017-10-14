import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

import { User } from '../../models/user.interface';
import { Brew } from '../../../brew/models/brew.interface';

@Component({
  selector: 'brew-log-overview',
  styleUrls: ['brew-log-overview.component.scss'],
  templateUrl: './brew-log-overview.component.html'
})
export class BrewLogOverviewComponent implements OnChanges {
  pageStyle: any = {};

  @Input()
  brews: Array<Brew>;

  @Input()
  page: number;

  @Output()
  view: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnChanges() {
    switch(this.page) {
      case 1:
        this.pageStyle = {};
        break;
      case 2:
        this.pageStyle = {'margin-top': '-306px'};
        break;
      case 3:
        this.pageStyle = {'margin-top': '-612px'};
        break;
    }
  }

  viewBrew(id) {
    this.view.emit(id);
  }
}
