import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';

import { User } from '../../models-shared/user.interface';
import { currentUser } from '../../models-shared/getUser.model';

@Component({
  selector: 'user-dashboard',
  styleUrls: ['user-dashboard.component.scss'],
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {
  loading: any;
  currentUser: User;

  constructor(
    private router: Router,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: currentUser,
      variables: {
        id: 'VXNlcjox'
      }
    }).subscribe(({data, loading}) => {
      this.loading = loading;
      this.currentUser = data['getUser'];
    });
  }
}
