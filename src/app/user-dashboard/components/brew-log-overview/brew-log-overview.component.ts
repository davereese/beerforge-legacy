import { Component, Input, Output, EventEmitter } from '@angular/core';

import { User } from '../../models/user.interface';

@Component({
  selector: 'brew-log-overview',
  styleUrls: ['brew-log-overview.component.scss'],
  templateUrl: './brew-log-overview.component.html'
})
export class BrewLogOverviewComponent {
  @Input()
  user: User;

  @Output()
  view: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  brewLog: EventEmitter<any> = new EventEmitter<any>();

  viewBrew(id) {
    this.view.emit(id);
  }

  goToBrewLog() {
    this.brewLog.emit();
  }
}
