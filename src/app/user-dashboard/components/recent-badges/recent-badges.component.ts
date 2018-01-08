import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { Badge } from '../../models/badge.interface';

@Component({
  selector: 'recent-badges',
  styleUrls: ['recent-badges.component.scss'],
  templateUrl: './recent-badges.component.html'
})
export class RecentBadgesComponent implements OnChanges {
  badges: Badge[];

  @Input()
  userBadges: Badge[];

  @Output()
  viewBadges: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnChanges() {
    if (0 < this.userBadges.length) {
      this.badges = this.userBadges.slice(0, 7);
    }
  }

  handleClick(event) {
    this.viewBadges.emit(event);
  }
}
