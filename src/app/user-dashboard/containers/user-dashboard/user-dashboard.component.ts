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
  userBrews: Array<Brew>;
  userSubscription: Subscription;
  brewsSubscription: Subscription;

  // Pagination arguments.
  defaultPageSize: number = 6;
  first: number = 18;
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
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.changeDetectorRef.detectChanges();
    });

    this.userBrewsService.loadInitialData(this.first);
    this.brewsSubscription = this.userBrewsService.brews$.subscribe(brews => {
      this.userBrews = brews['brews'];
      this.pageInfo = brews['pageInfo'];
      if (this.userBrews) {
        this.pages = Math.ceil(this.userBrews.length / this.defaultPageSize);
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

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.brewsSubscription.unsubscribe();
  }
}
