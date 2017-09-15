import { Component, Input } from '@angular/core';

import { User } from '../../models/user.interface';

@Component({
  selector: 'user-overview',
  styleUrls: ['user-overview.component.scss'],
  templateUrl: './user-overview.component.html'
})
export class UserOverviewComponent {
  @Input()
  user: User;

  batchNum: number;

  ngOnInit() {
    if (this.user) {
      this.batchNum = this.user.Brews.edges[0].node.batchNum;
    }
  }
}
