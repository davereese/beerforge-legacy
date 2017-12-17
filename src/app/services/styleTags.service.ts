import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { styleTagsQuery } from '../user-dashboard/models/styleTags.model';

@Injectable()
export class StyleTagsService {
  private _styleTags: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly styleTags$: Observable<any> = this._styleTags.asObservable();

  loadTags: ApolloQueryObservable<any> = this.apollo.use('auth').watchQuery({
    query: styleTagsQuery,
    variables: {
      style: true
    }
  });

  constructor(
    private apollo: Apollo
  ) {
    this.loadStyleTags();
  }

  loadStyleTags() {
    this.loadTags.subscribe(({data, loading}) => {
      this._styleTags.next(data['viewer'].allTags.edges);
    });
  }

  reloadTags() {
    this.loadTags.refetch();
  }
}
