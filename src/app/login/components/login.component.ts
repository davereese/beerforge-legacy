import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { modalPop } from '../../animations/modal-pop';

import { User } from '../../user-dashboard/models/user.interface';
import { currentUserQuery } from '../../user-dashboard/models/getUser.model';

import { LogInService } from '../../services/login.service';
import { UserService } from 'app/services/user.service';
import { UserBrewsService } from 'app/services/userBrews.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    modalPop
  ]
})
export class LoginComponent {
  showLogin: boolean;
  username: string = '';
  password: string = '';
  error: string = null;

  constructor(
    private loginService: LogInService,
    private userBrewsService: UserBrewsService,
    private userService: UserService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (localStorage.getItem('beerforge_JWT')) {
      this.router.navigate(['/dashboard']);
    } else {
      this.showLogin = true;
    }
  }

  handleLogin() {
    this.loginService.logInUser(this.username, this.password, (data) => {
      if ('success' === data) {

        // Subscribe to User
        this.userService.loadInitialData();
      
        // Subscribe to User's Brews List
        this.userBrewsService.loadInitialData();

        this.showLogin = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 300);
      } else {
        this.error = data.graphQLErrors[0].message;
      }
      this.changeDetectorRef.detectChanges();
    });
  }
}
