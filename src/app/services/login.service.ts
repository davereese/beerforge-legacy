import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { User } from '../user-dashboard/models/user.interface';
import { LoginUserQuery } from 'app/user-dashboard/models/login.model';

@Injectable()
export class LogInService {
  constructor(
    private apollo: Apollo
  ) { }

  logInUser(username, password, callback) {
    this.apollo.mutate({
      mutation: LoginUserQuery,
      variables: {
        input: {
          username: username,
          password: password
        }
      }
    }).subscribe(({data, loading}) => {
      localStorage.setItem('beerforge_JWT', data['loginUser'].token);
      localStorage.setItem('user_id', data['loginUser'].user.id);
      callback('success');
    },(error) => {
      callback(error);
    });
  }
}
