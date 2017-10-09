import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { User } from '../user-dashboard/models/user.interface';
import { Brew } from '../brew/models/brew.interface';
import { currentUserQuery } from '../user-dashboard/models/getUser.model';
import { currentBrewQuery } from '../brew/models/getBrew.model';

@Injectable()
export class UserService {
  // TODO: Actually get the real user id using some auth
  //       and then store in local storage or cookie.
  data: string = 'VXNlcjox';
  _currentUserID: BehaviorSubject<string>;
  currentUserID$: Observable<string>;
  _currentUser: BehaviorSubject<User>;
  currentUser$: Observable<User>;
  _currentBrew: BehaviorSubject<Brew>;
  currentBrew$: Observable<Brew>;

  constructor(
    private apollo: Apollo
  ) {
    this._currentUserID = new BehaviorSubject('');
    this.currentUserID$ = this._currentUserID.asObservable();
    this._currentUser = new BehaviorSubject(null);
    this.currentUser$ = this._currentUser.asObservable();
    this._currentBrew = new BehaviorSubject(null);
    this.currentBrew$ = this._currentBrew.asObservable();
  }

  getUserID(): Observable<string> {
    this._currentUserID.next(this.data);
    return Observable.of(this.data).map(data => JSON.stringify(data));
  }

  getCurrentUser(first = null, after = null, last = null, before = null) {
    this.apollo.watchQuery({
      query: currentUserQuery,
      variables: {
        id: this._currentUserID.value,
        first: first,
        after: after,
        last: last,
        before: before
      }
    }).subscribe(({data, loading}) => {
      this._currentUser.next(data['getUser']);
    });
  }

  getCurrentBrew(brewId: string) {
    this.apollo.watchQuery({
      query: currentBrewQuery,
      variables: {
        user_id: this._currentUserID.value,
        brew_id: brewId
      }
    }).subscribe(({data, loading}) => {
      this._currentBrew.next(data['viewer']['allBrews']['edges'][0].node);
    });
  }
}
