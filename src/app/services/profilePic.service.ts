import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { DefaultProfilePicsQuery } from '../user-dashboard/models/defaultProfilePics.model';

@Injectable()
export class ProfilePicService {
  constructor(
    private apollo: Apollo
  ) { }

  getRandomDefaultProfilePic(callback?) {
    const randomNum = Math.floor(Math.random() * 4) + 1;

    this.apollo.query({
      query: DefaultProfilePicsQuery,
      variables: {
        num: randomNum
      }
    }).subscribe(({data, loading}) => {
      callback(data);
    },(error) => {
      callback(error);
    });
  }
}
