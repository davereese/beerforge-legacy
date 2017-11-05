import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { User } from '../user-dashboard/models/user.interface';
import { SignUpUserQuery } from '../user-dashboard/models/signup.model';
import { ProfilePicService } from '../services/profilePic.service';

@Injectable()
export class SignUpService {
  private profilePic: string;

  constructor(
    private apollo: Apollo,
    private profilePicService: ProfilePicService
  ) { }

  signUpUser(username, email, password, callback?) {
    // first check for existing. Than, get random profile pic id so we don't have to add it later
    if (undefined === this.profilePic) {
      this.profilePicService.getRandomDefaultProfilePic(data => {
        this.profilePic = data.viewer.allProfilePics.edges[0].node.id;
        this.initiateSignUp(username, email, password, callback);
      });
    } else {
      this.initiateSignUp(username, email, password, callback);
    }
  }

  initiateSignUp(username, email, password, callback?) {
    this.apollo.mutate({
      mutation: SignUpUserQuery,
      variables: {
        input: {
          username: username,
          email: email,
          password: password,
          profilePicId: this.profilePic
        }
      }
    }).subscribe(({data, loading}) => {
      // save data for logged in use
      localStorage.setItem('beerforge_JWT', data['createUser'].token);
      localStorage.setItem('user_id', data['createUser'].changedUser.id);
      callback('success');
    },(error) => {
      const errorMessage: string = error.toString();
      let errorObj: any = {};
      // The errors are a little bit different for this one, so we need to do some parsing ourselves
      if ( -1 !== errorMessage.search('Error: GraphQL error: Operation failed uniqueness constraint: ')) {
        if (-1 !== errorMessage.search('email')) {
          errorObj.error = 'Email already in use.';
          errorObj.type = 'email';
        } else if (-1 !== errorMessage.search('username')) {
          errorObj.error = 'Username already in use';
          errorObj.type = 'username';
        }
      } else {
        errorObj.message = errorMessage;
      }
      callback(errorObj);
    });
  }
}