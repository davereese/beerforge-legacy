import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Brew } from '../../models/brew.interface';
import { UserService } from '../../../user.service';
import { BrewCalcService } from '../../services/brewCalc.service';
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
  totalMalt: number = 0;
  totalHop: number = 0;
  hopIBUs: any = [];
  totalIBUs: number = 0;
  totalSRM: number = 0;
  co2: number = 0;
  abv: number = 0;
  attenuation: number = 0;

  constructor(
    private userService: UserService,
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
        this.userId = data
      });

    this.apollo.watchQuery({
      query: currentBrewQuery,
      variables: {
        user_id: this.userId,
        brew_id: this.brewId
      }
    }).subscribe(({data, loading}) => {
      this.currentBrew = data['viewer']['allBrews']['edges'][0].node;

      // calculate total malt
      for (let index = 0; index < this.currentBrew.maltChoice.edges.length; index++) {
        this.totalMalt += this.currentBrew.maltChoice.edges[index].node.amount;
      }

      // calculate SRM
      this.totalSRM = this.brewCalcService.calculateSRM(this.currentBrew.maltChoice.edges, this.currentBrew.batchSize);

      for (let index = 0; index < this.currentBrew.hopChoice.edges.length; index++) {
        // calculate individual and total IBUs
        let volume = this.currentBrew.batchSize > this.currentBrew.boilWaterVol ? this.currentBrew.batchSize : this.currentBrew.boilWaterVol;
        this.hopIBUs[index] = this.brewCalcService.calculateIBUs( this.currentBrew.hopChoice.edges[index].node, volume, this.currentBrew.preBoilGravity );

        this.totalIBUs += this.hopIBUs[index];
        this.totalHop += this.currentBrew.hopChoice.edges[index].node.amount;
      }

      // calculate CO2
      // TODO: calculate CO2 if carbonateType is something other than forced
      this.co2 = this.brewCalcService.calculateCO2(this.currentBrew.carbonateTemp, this.currentBrew.carbonateCo2Vol, this.currentBrew.carbonateType);

      this.attenuation = this.brewCalcService.calculateAttenuation(this.currentBrew.originalGravity, this.currentBrew.finalGravity);

      // calculate ABV
      this.abv = this.brewCalcService.calculateABV(this.currentBrew.originalGravity, this.currentBrew.finalGravity);
    });
  }
}