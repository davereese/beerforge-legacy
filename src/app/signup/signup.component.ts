import { Component, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, ApplicationRef, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { modalPop } from '../animations/modal-pop';
import { Observable } from 'rxjs/Observable';

import { User } from '../user-dashboard/models/user.interface';
import { SignUpService } from '../services/signup.service';
import { UserService } from '../services/user.service';
import { UserBrewsService } from '../services/userBrews.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
  showSignUp: boolean;
  username: string = '';
  email1: string = '';
  email2: string = '';
  password1: string = '';
  password2: string = ''
  usernameError: boolean = false;
  email1Error: boolean = false;
  email2Error: boolean = false;
  passwordError: boolean = false;
  error: string = '';

  @ViewChildren('input') inputElRef: QueryList<any>;
  
  constructor(
    private ngzone: NgZone,
    private signUpService: SignUpService,
    private userService: UserService,
    private userBrewsService: UserBrewsService,
    private router: Router,
    private appref: ApplicationRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (localStorage.getItem('beerforge_JWT')) {
      this.router.navigate(['/dashboard']);
    } else {
      this.showSignUp = true;
    }
  }

  ngAfterViewInit() {
    this.ngzone.runOutsideAngular( () => {
      this.inputElRef.forEach(input => {
        Observable.fromEvent(input.nativeElement, 'keyup')
          .debounceTime(1000)
          .subscribe(keyboardEvent => {
            this.validateForm();
          });
      });
    });
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

  compareInputs(input1: string, input2: string, callback?) {
    if (input1 !== '' && input2 !== '') {
      if (input1 !== input2) {
        callback(false);
      }
    }
    callback(true);
  }

  validateForm() {
    // reset errors
    this.usernameError = false;
    this.email1Error = false;
    this.email2Error = false;
    this.passwordError = false;
    this.error = '';

    // check email fields
    if ('' !== this.email1 && !this.validateEmail(this.email1)) {
      this.email1Error = true;
    }
    if ('' !== this.email2 && !this.validateEmail(this.email2)) {
      this.email2Error = true;
    }
    if (this.email1Error || this.email2Error) {
      this.error += 'Please enter a valid email address. ';
    }
    // compare email and password fields
    this.compareInputs(this.email1, this.email2,  (data) =>{
      if (!data) {
        this.email1Error = true;
        this.email2Error = true;
        this.error += 'Email addresses do not match. ';
      }
    });
    this.compareInputs(this.password1, this.password2, (data) =>{
      if (!data) {
        this.passwordError = true;
        this.error += 'Passwords do not match.';
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  handleSignUp() {
    if ('' !== this.username && '' !== this.email1 && '' !== this.email2 && '' !== this.password1 && '' !== this.password2) {
      this.validateForm();
      if ('' === this.error) {
        this.signUpService.signUpUser(this.username, this.email1, this.password1, (data) => {
          if ('success' === data) {
            // Subscribe to User
            this.userService.loadInitialData();
        
            // Subscribe to User's Brews List
            this.userBrewsService.loadInitialData();
    
            this.showSignUp = false;
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 300);
          } else {
            this.error = data.error;
            if ('email' === data.type) {
              this.email1Error = true;
              this.email2Error = true;
            } else if ('username' === data.type) {
              this.usernameError = true;
            }
          }
          this.changeDetectorRef.detectChanges();
        });
      }
    } else {
      this.error = 'Please fill out all fields.';
      this.changeDetectorRef.detectChanges();
    }
  }
}
