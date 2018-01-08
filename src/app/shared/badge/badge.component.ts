import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

import { Badge } from 'app/user-dashboard/models/badge.interface';

@Component({
  selector: 'badge',
  styleUrls: ['badge.component.scss'],
  templateUrl: './badge.component.html'
})
export class badgeComponent implements OnInit {
  @Input()
  badgeData: Badge;

  @Input()
  showBadgeDescription: Boolean = true;

  @Input()
  smallBadge: Boolean = false;

  @Input()
  miniBadge: Boolean = false;

  @Input()
  noFlip: Boolean = false;

  constructor() {}

  ngOnInit() {}
}
