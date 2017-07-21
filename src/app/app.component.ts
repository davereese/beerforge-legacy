import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { UserService } from './user.service';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: any;
  dashboard: boolean = true; // used in header bar display
  bodyClass: string; // used to change site background colors
  today = new Date();
  year = this.today.getFullYear();
  userId: string;
  currentUser: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        let brewString = event.urlAfterRedirects.split('/');
        if ( 'dashboard' === brewString[1] ) {
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

    // get userID from user service
    this.userService
      .getUser()
      .subscribe((data: string) => {
        this.userId = data
      });
    // use it in the scaphold query
    this.apollo.watchQuery({
      query: gql`query currentUser($id: ID!) {
        getUser(id: $id) {
          firstName,
          lastName,
          username,
          profilePic {
            defaultPicNumber,
            blobUrl
          }
        }
      }`,
      variables: {
        id: this.userId
      }
    }).subscribe(({data, loading}) => {
      this.loading = loading;
      this.currentUser = data['getUser'];
    });
  }

  viewDashboard(event: any) {
    this.router.navigate(['/dashboard']);
  }
}
