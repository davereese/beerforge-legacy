import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';

import { User } from '../../models/user.interface';
import { currentUserQuery } from '../../models/getUser.model';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'user-dashboard',
  styleUrls: ['user-dashboard.component.scss'],
  templateUrl: './user-dashboard.component.html',
})
export class UserDashboardComponent {
  userId: string;
  totalBrews: number;
  currentUser: User;

  // Pagination arguments.
  defaultPageSize: number = 6;
  first: number = 18;
  pages: number;
  currentPage: number = 1;

  constructor(
    private userService: UserService,
    private router: Router,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.userService
      .getUser()
      .subscribe((data: string) => {
        this.userId = data
      });

    this.apollo.watchQuery({
      query: currentUserQuery,
      variables: {
        id: this.userId,
        first: this.first,
      }
    }).subscribe(({data, loading}) => {
      this.currentUser = data['getUser'];
      this.pages = Math.ceil(this.currentUser.Brews.edges.length / this.defaultPageSize);
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
}
