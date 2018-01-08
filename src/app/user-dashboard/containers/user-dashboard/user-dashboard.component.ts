import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../models/user.interface';
import { Brew } from '../../../brew/models/brew.interface';
import { Badge } from '../../models/badge.interface';
import { UserService } from '../../../services/user.service';
import { UserBrewsService } from '../../../services/userBrews.service';
import { UserBadgesService } from 'app/services/userBadges.service';

@Component({
  selector: 'user-dashboard',
  styleUrls: ['user-dashboard.component.scss'],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  currentUser: User;
  userBrews: Brew[] = [];
  userBadges: Badge[] = [];
  userSubscription: Subscription;
  brewsSubscription: Subscription;
  badgesSubscription: Subscription;

  // Pagination arguments.
  first: number = 18; // number of brews
  defaultPageSize: number = 6;
  pages: number;
  currentPage: number = 1;
  pageInfo: Object;

  constructor(
    private userService: UserService,
    private userBrewsService: UserBrewsService,
    private userBadgesService: UserBadgesService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    /** USER **/
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.userService.loadInitialData();
      }
      this.changeDetectorRef.detectChanges();
    });

    /** BREWS **/
    this.brewsSubscription = this.userBrewsService.brews$.subscribe(brews => {
      this.userBrews = [];
      this.pageInfo = brews['pageInfo'];
      if (brews['brews']) {
        let count = 1;
        brews['brews'].forEach(brew => {
          if (this.first >= count) {
            this.userBrews.push(brew);
          }
          count++;
        });
        this.pages = Math.ceil(this.userBrews.length / this.defaultPageSize);
      }
      this.changeDetectorRef.detectChanges();
    });

    // if you are coming from a route that has changed the results to be less than 18, reload the data
    if (0 !== this.userBrews.length && this.first > this.userBrews.length) {
      this.userBrews = [];
      this.userBrewsService.loadInitialData();
      this.changeDetectorRef.detectChanges();
    }

    /** BADGES **/
    this.badgesSubscription = this.userBadgesService.badges$.subscribe(badges => {
      this.userBadges = [];
      if (badges) {
        this.userBadges = badges;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  handleGetPage(event) {
    this.currentPage = event;
  }

  handleBrew(event: any) {
    this.router.navigate(['/brew']);
  }

  handleView(event: any) {
    this.router.navigate(['/brew/', event]);
  }

  handleBrewLog() {
    this.router.navigate(['/brew-log']);
  }

  handleEditProfile(event: any) {
    this.router.navigate(['/profile']);
  }

  handleViewBadges(event: any) {
    this.router.navigate(['/badges']);
  }

  ngOnDestroy() {
    if (undefined !== this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (undefined !== this.brewsSubscription) {
      this.brewsSubscription.unsubscribe();
    }
    if (undefined !== this.badgesSubscription) {
      this.badgesSubscription.unsubscribe();
    }
  }
}
