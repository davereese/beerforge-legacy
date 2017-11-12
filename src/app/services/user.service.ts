import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../user-dashboard/models/user.interface';
import { Brew } from '../brew/models/brew.interface';
import { currentUserQuery } from '../user-dashboard/models/getUser.model';
import { updateProfileMutation, deleteProfilePicMutation } from '../user-dashboard/models/updateUser.model';
import { scaphold } from '../../../scaphold/scaphold';

@Injectable()
export class UserService {
  private userID = localStorage.getItem('user_id');
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  public readonly currentUser$: Observable<User> = this._currentUser.asObservable();

  constructor(
    private apollo: Apollo,
    private http: HttpClient
  ) { }

  loadInitialData() {
    this.apollo.use('auth').watchQuery({
      query: currentUserQuery,
      variables: {
        id: this.userID
      }
    }).subscribe(({data, loading}) => {
      this._currentUser.next(data['getUser']);
    });
  }

  saveProfilePic(profilePic, callback?) {
    // Apollo doen't have a way to do uploads, so we have to make our own http request
    let formData = new FormData();
    formData.append('query', `mutation createProfilePic($input: CreateProfilePicInput!) {
      createProfilePic(input: $input) {
        changedProfilePic {
          id
        }
      }
    }`);
    formData.append('variables', JSON.stringify({
      'input': {
        'blobFieldName': 'newProfilePic'
      }
    }));
    formData.append('newProfilePic', profilePic.nativeElement.files[0]);

    this.http.post(scaphold, formData, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('beerforge_JWT')}`),
    }).subscribe(data => {
      callback(data);
    },(error) => {
      callback(error);
    });
  }

  deleteProfilePic(picId) {
    this.apollo.use('auth').mutate({
      mutation: deleteProfilePicMutation,
      variables: {
        input: {
          id: picId
        }
      }
    });
  }

  updateUserRequest(updateProfileInut, callback?) {
    this.apollo.use('auth').mutate({
      mutation: updateProfileMutation,
      variables: {
        input: updateProfileInut
      }
    }).subscribe(({data, loading}) => {
      this._currentUser.next(data['updateUser'].changedUser);
      callback('success');
    },(error) => {
      callback(error);
    });
  }

  updateUser(username, firstName, lastName, email, city, state, profilePic, callback?) {
    const updateProfileInut: any = {
      id: this.userID,
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      city: city,
      state: state
    };

    if (null !== profilePic) {
      let imageSuccess = false;
      // if profile pic is not null, create a new profile pic
      this.saveProfilePic(profilePic, data => {
        // then update user with the new profile pic id included if savig it didn't return in an error
        if (data.data) {
          imageSuccess = true;
          updateProfileInut.profilePicId = data.data.createProfilePic.changedProfilePic.id;
          // also, delete the old profile pic so we save room on the backend
          this.deleteProfilePic(this._currentUser.getValue().profilePic.id);
        }

        this.updateUserRequest(updateProfileInut, data => {
          if ( 'success' !== data ) {
            // if there was an error updating the profile, delete the new image so we don't have
            // a bunch of orphan images all ofver the place
            this.deleteProfilePic(data.data.createProfilePic.changedProfilePic.id);
          }
          callback({user: data, profilePic: imageSuccess});
        });
      });
    } else {
      // if no profile pic, just update the user without it
      this.updateUserRequest(updateProfileInut, data => {
        callback({user: data});
      });
    }
  }
}
