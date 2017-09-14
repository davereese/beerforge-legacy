import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Brew } from '../../models/brew.interface';
import { UserService } from '../../../services/user.service';
import { BrewFormService } from '../../../services/brewForm.service';
import { BrewCalcService } from '../../../services/brewCalc.service';
import { currentBrewQuery } from '../../models/getBrew.model';

@Component({
  selector: 'view-brew',
  styleUrls: ['view-brew.component.scss'],
  templateUrl: './view-brew.component.html',
})
export class viewBrewComponent {
  userId: string;
  brewId: string;
  currentBrew: Brew;
  brewForm: FormGroup;
  newBrewForm: BehaviorSubject<FormGroup>;

  constructor(
    private userService: UserService,
    private brewFormService: BrewFormService,
    private brewCalcService: BrewCalcService,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.brewId = params['id'];
      });

    this.userService
      .getUser()
      .subscribe((data: string) => {
        this.userId = data;
      });

    this.newBrewForm = this.brewFormService.newBrewForm;
    this.newBrewForm.subscribe((data) => {
      this.brewForm = data
    });

    this.apollo.watchQuery({
      query: currentBrewQuery,
      variables: {
        user_id: this.userId,
        brew_id: this.brewId
      }
    }).subscribe(({data, loading}) => {
      this.currentBrew = data['viewer']['allBrews']['edges'][0].node;

      this.brewFormService.loadForm(this.currentBrew);
    });
  }
}