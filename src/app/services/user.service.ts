import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  // TODO: Actually get the real user id using some auth
  //       and then store in local storage or cookie.
  public data: string = 'VXNlcjox';

  getUser(): Observable<string> {
    return Observable.of(this.data).map(data => JSON.stringify(data));
  }
}
