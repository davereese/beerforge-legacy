import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Badge } from 'app/user-dashboard/models/badge.interface';
import { Earnings } from 'app/user-dashboard/models/earnings.interface';
import { FormGroup, FormArray } from '@angular/forms';
import { currentUserEarningsQuery } from 'app/user-dashboard/models/getUserEarnings.model';
import { badgeQuery, addAchievementMutation, addBrewAchievementMutation } from 'app/user-dashboard/models/badges.model';
import { BadgeId } from 'app/shared/badge/badgeIds';
import { UserBadgesService } from 'app/services/userBadges.service';

@Injectable()
export class BadgeService {
  brew: FormGroup;
  brewId: string;
  calculationComplete: boolean = false;
  private userId = localStorage.getItem('user_id');
  private currentEarnings: Earnings;
  private currentBadges: Array<string>;
  private badgesSubscription: Subscription;
  private badgeIds: Array<string>;
  private badgesEarned: Array<any>;
  private _badges: BehaviorSubject<Badge[]> = new BehaviorSubject([]);
  public readonly badges$: Observable<Badge[]> = this._badges.asObservable();

  userEarnings: ApolloQueryObservable<any> = this.apollo.use('auth').watchQuery({
    query: currentUserEarningsQuery,
    variables: {
      id: this.userId
    }
  });

  constructor(
    private userBadgesService: UserBadgesService,
    private apollo: Apollo
  ) {
    this.badgeIds = [];
    this.badgesEarned = [];
    this.currentBadges = [];
  }

  loadEarnings() {
    this.userEarnings.subscribe(({data, loading}) => {
      // TODO: Rework user earnings to be new table and query
      this.currentEarnings = data.getUser;
      this.calculateBadges(this.brew, this.brewId);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  // unused
  refreshEarnings() {
    this.userEarnings.refetch();
  }

  updateEarnings() {
    // save updated earnings if we have form data
    if (this.brew) {
      // TODO: Add things to save to user that we want to track for badges
    }
  }

  saveBadges(badgeId): any {
    // Save the badges to the brew that earned them and to the user
    // add brew connection
    this.apollo.use('auth').mutate({
      mutation: addBrewAchievementMutation,
      variables: {
        badge: {
          badgeId: badgeId,
          brewId: this.brewId
        }
      }
    }).subscribe(({data, loading}) => {
      if (data) {
        // add user connection if brew connection was successful
        this.apollo.use('auth').mutate({
          mutation: addAchievementMutation,
          variables: {
            badge: {
              badgeId: badgeId,
              userId: this.userId
            }
          }
        }).subscribe(({data, loading}) => {
          if (data) {
            // return badge data
            this.badgesEarned.push(data);
            // this lets us know when everything is complete
            if (this.badgesEarned.length === this.badgeIds.length) {
              this.calculationComplete = true;
            }
            this._badges.next(this.badgesEarned);
          } else {
            console.log('Error saving user achievement connection.');
          }
        });
      } else {
        console.log('Error saving brew achievement connection.');
      }
    });
  }

  calculateBadges(newBrew: FormGroup, brewId: string) {
    this.brew = newBrew;
    this.brewId = brewId;
    this.calculationComplete = false;

    this.badgesSubscription = this.userBadgesService.badges$.subscribe(badges => {
      if (badges) {
        badges.forEach(badge => {
          this.currentBadges.push(badge.id);
        });
      }
    });

    if (!this.currentEarnings) {
      this.loadEarnings();
    } else {
      // The Badge functions (adds id to array if earned)
      this.earnedFirstForged(newBrew);
      this.earnedTwentyfifthForged(newBrew);

      // loop over array of earned badges and save to DB
      if (0 < this.badgeIds.length) {
        this.badgeIds.forEach(badge => {
          this.saveBadges(badge);
        });
      }

      // updage earnings
      this.updateEarnings();
    }
  }

  /** BADGE CALCULATIONS  **/

  earnedFirstForged(newBrew) {
    const batchNum = newBrew.get('brewFormAuto.batchNum').value;
    // check to see if user already has badge
    if (this.currentBadges.indexOf(BadgeId.FIRST_FORGED) === -1) {
      if (1 <= batchNum) {
        this.badgeIds.push(BadgeId.FIRST_FORGED);
      }
    }
  }

  earnedTwentyfifthForged(newBrew) {
    const batchNum = newBrew.get('brewFormAuto.batchNum').value;
    // check to see if user already has badge
    if (this.currentBadges.indexOf(BadgeId.TWENTYFIFTH_FORGED) === -1) {
      if (25 <= batchNum) {
        this.badgeIds.push(BadgeId.TWENTYFIFTH_FORGED);
      }
    }
  }
}
