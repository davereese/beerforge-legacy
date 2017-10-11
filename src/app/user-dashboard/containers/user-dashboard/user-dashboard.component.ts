import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../models/user.interface';
import { currentUserQuery } from '../../models/getUser.model';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'user-dashboard',
  styleUrls: ['user-dashboard.component.scss'],
  templateUrl: './user-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  currentUser: User;
  userSubscription: Subscription;

  // Pagination arguments.
  defaultPageSize: number = 6;
  first: number = 18;
  pages: number;
  currentPage: number = 1;

  constructor(
    private userService: UserService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser(this.first);
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.pages = Math.ceil(user.Brews.edges.length / this.defaultPageSize);
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  handleGetPage(event) {
    this.currentPage = event;
  }

  handleNextPage() {
    this.currentPage = this.currentPage+1;
  }

  handlePrevPage() {
    this.currentPage = this.currentPage-1;
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
  }
}
