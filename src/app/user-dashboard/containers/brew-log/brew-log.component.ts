import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';

import { User } from '../../models/user.interface';
import { currentUserQuery } from '../../models/getUser.model';

import { UserService } from '../../../services/user.service';
import { BrewCalcService } from '../../../services/brewCalc.service';

@Component({
  selector: 'brew-log',
  styleUrls: ['brew-log.component.scss'],
  templateUrl: './brew-log.component.html',
})
export class BrewLogComponent {
  userId: string;
  currentUser: User;

  // Pagination arguments.
  results: number = 20;
  page: number = 1;

  constructor(
    private userService: UserService,
    private brewCalcService: BrewCalcService,
    private router: Router,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.userService
    .getUser()
    .subscribe((data: string) => {
      this.userId = data
    });

    this.fetchBrews(this.results);
  }

  fetchBrews(first = null, after = null, last = null, before = null) {
    this.apollo.watchQuery({
      query: currentUserQuery,
      variables: {
        id: this.userId,
        first: first,
        after: after,
        last: last,
        before: before
      }
    }).subscribe(({data, loading}) => {
      this.currentUser = data['getUser'];
    });
  }

  newBrew() {
    this.router.navigate(['/brew']);
  }

  handlePrevPage(item) {
    this.fetchBrews(null, null, this.results, item);
    this.page -= 1;
  }

  handleFirstPage() {
    this.fetchBrews(this.results);
    this.page = 1;
  }

  handleNextPage(item) {
    this.fetchBrews(this.results, item, null, null);
    this.page += 1;
  }

  viewBrew(id) {
    this.router.navigate(['/brew/', id]);
  }
}
