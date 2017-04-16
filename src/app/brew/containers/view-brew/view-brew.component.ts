import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Brew } from '../../models-shared/brew.interface';
import { currentBrewQuery } from '../../models-shared/getBrew.model';
import { UserService } from '../../../user.service';

@Component({
  selector: 'view-brew',
  styleUrls: ['view-brew.component.scss'],
  templateUrl: './view-brew.component.html',
})
export class viewBrewComponent {
  loading: any;
  userId: string;
  brewId: string;
  currentBrew: Brew;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.brewId = params['id'];
      });

    this.userService
      .getUser()
      .subscribe((data: string) => {
        this.userId = data
      });

    this.apollo.watchQuery({
      query: currentBrewQuery,
      variables: {
        user_id: this.userId,
        brew_id: this.brewId
      }
    }).subscribe(({data, loading}) => {
      this.loading = loading;
      this.currentBrew = data['viewer']['allBrews']['edges'][0]['node'];
    });
  }
}