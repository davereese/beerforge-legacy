import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../models/user.interface';
import { Brew } from '../../../brew/models/brew.interface';
import { currentUserQuery } from '../../models/getUser.model';

import { UserService } from '../../../services/user.service';
import { UserBrewsService } from '../../../services/userBrews.service';

@Component({
  selector: 'user-dashboard',
  styleUrls: ['user-dashboard.component.scss'],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  currentUser: User;
  userBrews: Array<Brew> = [];
  userSubscription: Subscription;
  brewsSubscription: Subscription;

  // Pagination arguments.
  first: number = 18; // number of brews
  defaultPageSize: number = 6;
  pages: number;
  currentPage: number = 1;
  pageInfo: Object;

  constructor(
    private userService: UserService,
    private userBrewsService: UserBrewsService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userService.loadInitialData();
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.changeDetectorRef.detectChanges();
    });

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
      return;
    }
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
    this.router.navigate(['/profile/', this.currentUser.id]);
  }

  ngOnDestroy() {
    if (undefined !== this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (undefined !== this.brewsSubscription) {
      this.brewsSubscription.unsubscribe();
    }
  }
}
