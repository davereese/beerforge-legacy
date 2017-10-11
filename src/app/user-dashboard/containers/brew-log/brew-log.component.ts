import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../models/user.interface';
import { currentUserQuery } from '../../models/getUser.model';

import { UserService } from '../../../services/user.service';
import { BrewCalcService } from '../../../services/brewCalc.service';

@Component({
  selector: 'brew-log',
  styleUrls: ['brew-log.component.scss'],
  templateUrl: './brew-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrewLogComponent implements OnInit, OnDestroy {
  currentUser: User;
  userSubscription: Subscription;

  // Pagination arguments.
  results: number = 20;
  page: number = 1;

  constructor(
    private userService: UserService,
    private brewCalcService: BrewCalcService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser(this.results);
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.changeDetectorRef.detectChanges();
    });
  }

  newBrew() {
    this.router.navigate(['/brew']);
  }

  handlePrevPage(item) {
    this.userService.getCurrentUser(null, null, this.results, item);
    this.page -= 1;
  }

  handleFirstPage() {
    this.userService.getCurrentUser(this.results);
    this.page = 1;
  }

  handleNextPage(item) {
    this.userService.getCurrentUser(this.results, item, null, null);
    this.page += 1;
  }

  viewBrew(id) {
    this.router.navigate(['/brew/', id]);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
