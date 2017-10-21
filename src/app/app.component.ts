import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from './user-dashboard/models/user.interface';
import { currentUserQuery } from './user-dashboard/models/getUser.model';

import { UserService } from './services/user.service';
import { UserBrewsService } from 'app/services/userBrews.service';
import { LogInService } from 'app/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserBrewsService, UserService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  loading: any;
  dashboard: boolean = false; // used in header bar display
  login: boolean = false; // used in header bar display
  bodyClass: string; // used to change site background colors
  today = new Date();
  year = this.today.getFullYear();
  currentUser: User;
  userSubscription: Subscription;

  constructor(
    private userService: UserService,
    private loginService: LogInService,
    private userBrewsService: UserBrewsService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.dashboard = false;
        this.login = false;
        const brewString = event.urlAfterRedirects.split('/');

        // send all routes back to login page if we're not logged in
        if (null === localStorage.getItem('beerforge_JWT') && 'login' !== brewString[1]) {
          this.router.navigate(['/login']);
        }

        // All of this stuff manipulates the background color animations
        // TODO: refactor this
        if ( 'dashboard' === brewString[1] || 'brew-log' === brewString[1] ) {
          this.bodyClass = 'background dash';
        } else if ( 'brew' === brewString[1] ) {
          if ( brewString[2] ) {
            this.bodyClass = 'background view';
          } else {
            this.bodyClass = 'background brew';
          }
        } else if ( 'login' === brewString[1] ) {
          this.bodyClass = 'background login';
        }

        // conditionals for showing and hiding top bar stuff
        if ( 'dashboard' === brewString[1] ) {
          this.dashboard = true;
        } else if ( 'login' === brewString[1] ) {
          this.login = true;
        }
      }
    });

    
    if (null !== localStorage.getItem('beerforge_JWT')) {
      // Subscribe to User
      this.userService.loadInitialData();

      // Subscribe to User's Brews List
      this.userBrewsService.loadInitialData();
    }

    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.changeDetectorRef.detectChanges();
    });
  }

  viewDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logOut() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('beerforge_JWT');
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
