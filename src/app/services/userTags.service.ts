import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { currentUserTagsQuery } from '../user-dashboard/models/getUserTags.model';

@Injectable()
export class UserTagsService {
  private userID = localStorage.getItem('user_id');
  private _userTags: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly userTags$: Observable<any> = this._userTags.asObservable();

  loadTags: ApolloQueryObservable<any> = this.apollo.use('auth').watchQuery({
    query: currentUserTagsQuery,
    variables: {
      id: this.userID
    }
  });

  constructor(
    private apollo: Apollo
  ) {
    this.loadUserTags();
  }

  loadUserTags() {
    this.loadTags.subscribe(({data, loading}) => {
      this._userTags.next(data['viewer'].allTags.edges);
    });
  }

  reloadTags() {
    this.loadTags.refetch();
  }
}
