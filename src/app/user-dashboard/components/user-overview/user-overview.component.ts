import { Component, Input } from '@angular/core';

import { User } from '../../models-shared/user.interface';

@Component({
  selector: 'user-overview',
  styleUrls: ['user-overview.component.scss'],
  templateUrl: './user-overview.component.html'
})
export class UserOverviewComponent {
  @Input()
  user: User;
}
