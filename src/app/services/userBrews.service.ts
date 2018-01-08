import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { Brew } from '../brew/models/brew.interface';
import { currentUserBrewsQuery } from '../user-dashboard/models/getUserBrews.model';

@Injectable()
export class UserBrewsService {
  private _brews: BehaviorSubject<Brew[]> = new BehaviorSubject([]);
  public readonly brews$: Observable<Brew[]> = this._brews.asObservable();

  private results: number = 20; // initial load
  private userID: BehaviorSubject<any> = new BehaviorSubject([]);
  private firstResult: BehaviorSubject<any> = new BehaviorSubject([]);
  private after: BehaviorSubject<any> = new BehaviorSubject([]);
  private lastResult: BehaviorSubject<any> = new BehaviorSubject([]);
  private before: BehaviorSubject<any> = new BehaviorSubject([]);

  userBrews: ApolloQueryObservable<any> = this.apollo.use('auth').watchQuery({
    query: currentUserBrewsQuery,
    variables: {
      id: this.userID.asObservable(),
      first: this.firstResult.asObservable(),
      after: this.after.asObservable(),
      last: this.lastResult.asObservable(),
      before: this.before.asObservable()
    }
  });

  constructor(
    private apollo: Apollo
  ) {}

  loadInitialData(first = null, after = null, last = null, before = null) {
    this.refreshVariables(null !== first ? first : this.results, after, last, before, () => {
      this.userBrews.subscribe(({data, loading}) => {
        this.updateSubscriptions(data);
      });
    });
  }

  fetchMoreData(first = null, after = null, last = null, before = null) {
    this.userBrews.fetchMore({
      variables: {
        first: null !== first ? first : this.results,
        after: after,
        last: last,
        before: before
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        this.updateSubscriptions(fetchMoreResult);
      },
    });
  }

  refetchData() {
    this.userBrews.refetch();
  }

  updateSubscriptions(data) {
    const userBrews = Object();
    const brewArray = Array();
    data['viewer'].allBrews.edges.forEach(brew => {
      brewArray.push(brew.node);
    });
    userBrews['pageInfo'] = data['viewer'].allBrews.pageInfo;
    userBrews['brews'] = brewArray;
    userBrews['userId'] = this.userID.asObservable();
    this._brews.next(userBrews);
  }

  refreshVariables(first, after, last, before, callback?) {
    this.userID.next(localStorage.getItem('user_id'));
    this.firstResult.next(first);
    this.after.next(after);
    this.lastResult.next(last);
    this.before.next(before);
    callback();
  }
}
