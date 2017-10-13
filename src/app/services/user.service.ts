import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { User } from '../user-dashboard/models/user.interface';
import { Brew } from '../brew/models/brew.interface';
import { currentUserQuery } from '../user-dashboard/models/getUser.model';

@Injectable()
export class UserService {
  // TODO: Actually get the real user id using some auth
  //       and then store in local storage or cookie.
  data: string = 'VXNlcjox';
  private _currentUserID: BehaviorSubject<string> = new BehaviorSubject(String([]));
  public readonly currentUserID$: Observable<string> = this._currentUserID.asObservable();
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  public readonly currentUser$: Observable<User> = this._currentUser.asObservable();

  constructor(
    private apollo: Apollo
  ) {
    this.getUserID();
    this.loadInitialData();
  }

  getUserID(): Observable<string> {
    this._currentUserID.next(this.data);
    return Observable.of(this.data).map(data => JSON.stringify(data));
  }

  loadInitialData() {
    this.apollo.watchQuery({
      query: currentUserQuery,
      variables: {
        id: this._currentUserID.value
      }
    }).subscribe(({data, loading}) => {
      this._currentUser.next(data['getUser']);
    });
  }
}
