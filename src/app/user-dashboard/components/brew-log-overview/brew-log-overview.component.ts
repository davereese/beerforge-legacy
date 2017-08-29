import { Component, Input, Output, EventEmitter } from '@angular/core';

import { User } from '../../models/user.interface';

@Component({
  selector: 'brew-log-overview',
  styleUrls: ['brew-log-overview.component.scss'],
  templateUrl: './brew-log-overview.component.html'
})
export class BrewLogOverviewComponent {
  pageStyle: any = {};

  @Input()
  user: User;

  @Input()
  page: number;

  @Output()
  view: EventEmitter<any> = new EventEmitter<any>();

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
