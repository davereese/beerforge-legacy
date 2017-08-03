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
  userBrews: any = [];

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

    this.apollo.watchQuery({
      query: currentUserQuery,
      variables: {
        id: this.userId
      }
    }).subscribe(({data, loading}) => {
      this.currentUser = data['getUser'];
    });
  }

  newBrew() {
    this.router.navigate(['/brew']);
  }

  viewBrew(id) {
    this.router.navigate(['/brew/', id]);
  }
}
