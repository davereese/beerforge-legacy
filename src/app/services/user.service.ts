import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { User } from '../user-dashboard/models/user.interface';
import { Brew } from '../brew/models/brew.interface';
import { currentUserQuery } from '../user-dashboard/models/getUser.model';

@Injectable()
export class UserService {
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  public readonly currentUser$: Observable<User> = this._currentUser.asObservable();

  constructor(
    private apollo: Apollo
  ) { }

  loadInitialData() {
    const userID = localStorage.getItem('user_id');
    this.apollo.watchQuery({
      query: currentUserQuery,
      variables: {
        id: userID
      }
    }).subscribe(({data, loading}) => {
      this._currentUser.next(data['getUser']);
    });
  }
}
