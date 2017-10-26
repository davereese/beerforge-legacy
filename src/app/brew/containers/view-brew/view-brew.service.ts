import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { Brew } from '../../../brew/models/brew.interface';
import { currentBrewQuery } from '../../../brew/models/getBrew.model';

@Injectable()
export class ViewBrewService {
  private _currentBrew: BehaviorSubject<Brew> = new BehaviorSubject(null);
  public readonly currentBrew$: Observable<Brew> = this._currentBrew.asObservable();

  private currentUserBrew: ApolloQueryObservable<any>;
  private brewId: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private userID: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    private apollo: Apollo
  ) {
    this.currentUserBrew = this.apollo.use('auth').watchQuery({
      query: currentBrewQuery,
      variables: {
        user_id: this.userID.asObservable(),
        brew_id: this.brewId.asObservable()
      }
    })
  }

  getCurrentBrew(brewId: string) {
    this.brewId.next(brewId);
    this.userID.next(localStorage.getItem('user_id'));
    this.currentUserBrew.subscribe(({data, loading}) => {
      this._currentBrew.next(data['getBrew']);
    });
  }

  refetchCurrentBrew() {
    this.currentUserBrew.refetch();
  }
}
