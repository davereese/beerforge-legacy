import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from './user-dashboard/models/user.interface';
import { currentUserQuery } from './user-dashboard/models/getUser.model';

import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  loading: any;
  dashboard: boolean = true; // used in header bar display
  bodyClass: string; // used to change site background colors
  today = new Date();
  year = this.today.getFullYear();
  first: number = 0; // number of brews
  currentUser: User;
  userSubscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        let brewString = event.urlAfterRedirects.split('/');
        if ( 'dashboard' === brewString[1] || 'brew-log' === brewString[1] ) {
          this.bodyClass = 'background dash';
        } else if ( 'brew' === brewString[1] ) {
          if ( brewString[2] ) {
            this.bodyClass = 'background view';
          } else {
            this.bodyClass = 'background brew';
          }
        }

        if ( 'dashboard' === brewString[1] ) {
          this.dashboard = true;
        } else {
          this.dashboard = false;
        }
      }
    });

    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.changeDetectorRef.detectChanges();
    });
  }

  viewDashboard(event: any) {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
