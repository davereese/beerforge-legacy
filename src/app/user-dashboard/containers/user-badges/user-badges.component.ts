import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Badge } from '../../models/badge.interface';
import { BadgeId } from '../../../shared/badge/badgeIds';
import { UserBadgesService } from 'app/services/userBadges.service';

@Component({
  selector: 'user-badges',
  styleUrls: ['user-badges.component.scss'],
  templateUrl: './user-badges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgesComponent implements OnInit {
  badgesSubscription: Subscription;
  userBadges: Badge[] = [];
  totalBadges: any[] = [];

  constructor(
    private userBadgesService: UserBadgesService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    /** BADGES **/
    this.badgesSubscription = this.userBadgesService.badges$.subscribe(badges => {
      this.userBadges = [];
      if (badges) {
        this.userBadges = badges;
        this.totalBadges = Array(BadgeId.TOTAL_BADGES - badges.length).fill(null)
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  newBrew() {
    this.router.navigate(['/brew']);
  }
}
