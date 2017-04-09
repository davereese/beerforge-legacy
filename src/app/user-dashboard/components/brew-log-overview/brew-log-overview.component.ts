import { Component, Input } from '@angular/core';

import { User } from '../../models-shared/user.interface';

@Component({
  selector: 'brew-log-overview',
  styleUrls: ['brew-log-overview.component.scss'],
  templateUrl: './brew-log-overview.component.html'
})
export class BrewLogOverviewComponent {
  @Input()
  user: User;
}
