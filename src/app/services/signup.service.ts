import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { User } from '../user-dashboard/models/user.interface';
import { SignUpUserQuery } from '../user-dashboard/models/signup.model';
import { ProfilePicService } from '../services/profilePic.service';
import { UserErrorHandler } from 'app/signup/userErrorHandler';

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
      callback(UserErrorHandler.parseErrors(error));
    });
  }
}