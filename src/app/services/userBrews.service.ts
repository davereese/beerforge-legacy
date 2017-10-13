import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../user-dashboard/models/user.interface';
import { Brew } from '../brew/models/brew.interface';
import { currentUserBrewsQuery } from '../user-dashboard/models/getUserBrews.model';
import { currentBrewQuery } from '../brew/models/getBrew.model';

@Injectable()
export class UserBrewsService {
  private _brews: BehaviorSubject<Object> = new BehaviorSubject(Object());
  public readonly brews$: Observable<Object> = this._brews.asObservable();
  private _currentBrew: BehaviorSubject<Brew> = new BehaviorSubject(null);
  public readonly currentBrew$: Observable<Brew> = this._currentBrew.asObservable();

  private first: number = 20;

  constructor(
    private apollo: Apollo
  ) { }

  loadInitialData(first = null, after = null, last = null, before = null) {
    this.apollo.watchQuery({
      query: currentUserBrewsQuery,
      variables: {
        id: 'VXNlcjox',
        first: null !== first ? first : this.first,
        after: after,
        last: last,
        before: before
      }
    }).subscribe(({data, loading}) => {
      const userBrews = Object();
      const brewArray = Array();
      data['getUser'].Brews.edges.forEach(brew => {
        brewArray.push(brew.node);
      });
      userBrews['pageInfo'] = data['getUser'].Brews.pageInfo;
      userBrews['brews'] = brewArray;
      userBrews['userId'] = data['getUser'].id;
      this._brews.next(userBrews);
    });
  }

  getCurrentBrew(brewId: string) {
    this.apollo.watchQuery({
      query: currentBrewQuery,
      variables: {
        user_id: 'VXNlcjox',
        brew_id: brewId
      }
    }).subscribe(({data, loading}) => {
      this._currentBrew.next(data['viewer']['allBrews']['edges'][0].node);
    });
  }
}
