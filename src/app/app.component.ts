import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { routeFades } from './animations/route-fades';

import { User } from './user-dashboard/models/user.interface';

import { UserService } from './services/user.service';
import { UserBrewsService } from 'app/services/userBrews.service';
import { LogInService } from 'app/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserBrewsService, UserService],
  animations: [routeFades],
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
  newBodyClass: string = '';
  oldBodyClass: string = '';
  profilePicUrl: string = '';

  constructor(
    private apollo: Apollo,
    private userService: UserService,
    private loginService: LogInService,
    private userBrewsService: UserBrewsService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if(event instanceof RoutesRecognized) {
        const url = event.urlAfterRedirects.split('/');
        this.oldBodyClass = this.newBodyClass;

        // All of this stuff manipulates the background color animations
        if ( 'brew' === url[1] ) {
          if ( url[2] ) {
            this.newBodyClass = 'view';
          } else {
            this.newBodyClass = 'brew';
          }
        } else if ( 'login' === url[1] ) {
          this.newBodyClass = 'login';
        } else if ( 'signup' === url[1] ) {
          this.newBodyClass = 'signup';
        } else if ( 'profile' === url[1] ) {
          this.newBodyClass = 'profile';
        } else {
          this.newBodyClass = 'dash';
        }

        this.animateFade();
      }

      if(event instanceof NavigationEnd) {
        this.dashboard = false;
        this.login = false;
        const url = event.urlAfterRedirects.split('/');

        // send all routes back to login page if we're not logged in
        if (!localStorage.getItem('beerforge_JWT') && ('login' !== url[1] && 'signup' !== url[1])) {
          this.router.navigate(['/login']);
        }

        // conditionals for showing and hiding top bar stuff
        if ( 'dashboard' === url[1] || 'profile' === url[1] ) {
          this.dashboard = true;
        } else if ( 'login' === url[1] || 'signup' === url[1] ) {
          this.login = true;
        }
      }
    });

    if (localStorage.getItem('beerforge_JWT') && localStorage.getItem('user_id')) {
      // Subscribe to User
      this.userService.loadInitialData();

      // Subscribe to User's Brews List
      this.userBrewsService.loadInitialData();
    }

    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profilePicUrl = this.currentUser.profilePic.blobUrl ? this.currentUser.profilePic.blobUrl : this.currentUser.profilePic.defaultPicNumber ? '../assets/images/plaid_' + this.currentUser.profilePic.defaultPicNumber + '.svg' : null
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  viewDashboard() {
    this.router.navigate(['/dashboard']);
  }

  animateFade() {
    this.oldBodyClass += ' fade';
    setTimeout(() => {
      this.oldBodyClass = '';
      this.changeDetectorRef.detectChanges();
    }, 500 );
  }

  getPage(outlet) {
    return outlet.activatedRouteData['page'];
  }

  logOut() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('beerforge_JWT');
    window.location.replace('/login');
  }

  ngOnDestroy() {
    if (undefined !== this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
