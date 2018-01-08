import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { Badge } from 'app/user-dashboard/models/badge.interface';
import { currentUserBadgesQuery } from 'app/user-dashboard/models/getUserBadges.model';

@Injectable()
export class UserBadgesService {
  private badgeArray: Badge[];
  private userID: BehaviorSubject<any> = new BehaviorSubject([]);
  private _badges: BehaviorSubject<Badge[]> = new BehaviorSubject([]);
  public readonly badges$: Observable<Badge[]> = this._badges.asObservable();

  userBadges: ApolloQueryObservable<any> = this.apollo.use('auth').watchQuery({
    query: currentUserBadgesQuery,
    variables: {
      id: this.userID.asObservable()
    }
  });

  constructor(
    private apollo: Apollo
  ) {
    this.badgeArray = [];
  }

  loadInitialData() {
    this.userID.next(localStorage.getItem('user_id'));
    this.userBadges.subscribe(({data, loading}) => {
      if (data) {
        data['viewer'].allBadges.edges.forEach(badge => {
          this.badgeArray.push(badge.node);
        });
        this._badges.next(this.badgeArray);
      }
    });
  }

  refetchData() {
    this.userBadges.refetch();
  }
}
