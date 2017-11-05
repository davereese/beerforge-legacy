import { Component, Input } from '@angular/core';

import { User } from '../../models/user.interface';
import { Brew } from 'app/brew/models/brew.interface';

@Component({
  selector: 'user-overview',
  styleUrls: ['user-overview.component.scss'],
  templateUrl: './user-overview.component.html'
})
export class UserOverviewComponent {
  @Input()
  user: User;

  @Input()
  userBrews: any[];

  constructor() { }
}
