import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Brew } from '../../models/brew.interface';

import { User } from '../../../user-dashboard/models/user.interface';
import { currentUserQuery } from '../../../user-dashboard/models/getUser.model';
import { saveBrewMutation } from '../../models/saveBrew.model';
import { saveMaltMutation } from '../../models/saveBrew.model';
import { saveHopMutation } from '../../models/saveBrew.model';
import { saveYeastMutation } from '../../models/saveBrew.model';

import { modalData } from '../../../modal/models/modal.model';
import { UserService } from '../../../services/user.service';
import { BrewCalcService } from '../../../services/brewCalc.service';

@Component({
  selector: 'new-brew',
  styleUrls: ['new-brew.component.scss'],
  templateUrl: './new-brew.component.html',
  animations: [
    trigger('flipInOut', [
      state('in', style({transform: 'translateX(0) rotateY(0deg) scale(1)'})),
      transition(':enter', [
        style({transform: 'translateX(128%) rotateY(-90deg) scale(1.3)'}),
        animate('0.49s cubic-bezier(0,0,.12,1)')
      ]),
      transition(':leave', [
        animate('0.35s ease-in', style({transform: 'translateX(128%) rotateY(-90deg) scale(1.3)'}))
      ])
    ]),
    trigger('modalPop', [
      state('in', style({transform: 'translate(-50%, -50%)', opacity: '1'})),
      transition(':enter', [
        style({transform: 'translate(-50%, -20%)', opacity: '0'}),
        animate('0.5s cubic-bezier(.54,0,.03,1)')
      ]),
      transition(':leave', [
        style({transform: 'translate(-50%, -50%)'}),
        animate('0.3s cubic-bezier(.54,0,.03,1)', style({transform: 'translate(-50%, -80%)', opacity: '0'}))
      ])
    ])
  ]
})
export class newBrewComponent implements OnInit {
  loader: boolean = false;
  modalData: modalData;
  showModal: boolean = false;
  userId: string;
  currentUser: User;
  brewName: string = 'New Brew';
  editingName: boolean = false;
  editingData: any = {};
  flipCard: boolean = false;
  editingSection: string;
  strikeVol: number = 0;
  strikeTemp: number = 0;
  spargeVol: number = 0;
  boilSize: number = 0;
  gravities: any = {};
  attenuationPercent: number = 0; // used to record the highest selected yeast attenuation %
  co2: string;
  newBrew: Brew;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private brewCalcService: BrewCalcService,
    private apollo: Apollo,
    private router: Router
  ) {}

  newBrewForm = this.fb.group({
    brewFormName: this.fb.group({
      name: (this.brewName),
    }),
    brewFormSettings: this.fb.group({
      batchType: (''),
      batchSize: (''),
      sysEfficiency: (''),
    }),
    brewFormFermentables: this.createFermentable({}),
    fermentables: this.fb.array([]),
    brewFormHops: this.createHop({}),
    hops: this.fb.array([]),
    brewFormAdjuncts: this.createAdjunct({}),
    adjuncts: this.fb.array([]),
    brewFormYeasts: this.createYeast({}),
    yeasts: this.fb.array([]),
    brewFormMash: this.fb.group({
      targetMashTemp: (''),
      waterToGrain: (''),
      initialGrainTemp: (''),
      mashTime: (''),
      spargeTemp: (''),
    }),
    brewFormBoil: this.fb.group({
      boilTime: (''),
      evaporationRate: (''),
      boilSize: (''),
    }),
    brewFormFermentation: this.fb.group({
      fermentTime: (''),
      fermentTemp: (''),
      fermentSecCheck: (false),
      fermentSecTime: (''),
      fermentSecTemp: (''),
    }),
    brewFormPackaging: this.fb.group({
      packageType: (''),
      carbonationMethod: (''),
      co2VolTarget: (''),
      beerTemp: (''),
    })
  })
  
  createFermentable(fermentable) {
    return this.fb.group({
      fermentable: (fermentable.fermentable || ''),
      fermentableId: (fermentable.fermentableId || ''),
      fermentableWeight: (fermentable.fermentableWeight || '')
    });
  }

  createHop(hop) {
    return this.fb.group({
      hop: (hop.hop || ''),
      hopId: (hop.hopId || ''),
      hopAlphaAcid: (hop.hopAlphaAcid || ''),
      hopTime: (0 === hop.hopTime ? 0 : hop.hopTime || ''),
      hopWeight: (hop.hopWeight || '')
    });
  }

  createAdjunct(adjunct) {
    return this.fb.group({
      adjunct: (adjunct.adjunct || ''),
      adjunctId: (adjunct.adjunctId || ''),
      adjunctWeight: (adjunct.adjunctWeight || '')
    });
  }

  createYeast(yeast) {
    return this.fb.group({
      yeast: (yeast.yeast || ''),
      yeastId: (yeast.yeastId || ''),
      yeastPackage: (yeast.yeastPackage || ''),
      yeastAmount: (yeast.yeastAmount || '')
    });
  }

  nameFocus(e) {
    this.editingName = true;
  }

  nameBlur(e, keyup = false) {
    if ( true === keyup ) {
      if ( 13 === e.keyCode ) {
        this.brewName = e.target.value;
        this.editingName = false;
      }
    } else {
      this.brewName = e.target.value;
      this.editingName = false;
    }

    if ( '' === e.target.value ) {
      this.brewName = 'New Brew';
    }
  }

  flipTheCard(editing, editingData = null) {
    this.editingSection = editing;
    this.editingData = editingData;
    this.flipCard = true;
  }

  closeTheCard() {
    this.flipCard = false;
  }

  nextCard() {
    let cards = ['settings', 'fermentables', 'hops', 'yeasts', 'mash', 'boil', 'fermentation', 'packaging'];
    let currentIndex = cards.indexOf(this.editingSection);

    this.editingSection = cards[currentIndex+1];
  }

  editingSelection(editingIndex) {
    let editing: string;
    if ( editingIndex.hasOwnProperty('fermentable') ) {
      editing = 'editFermentable';
    } else if ( editingIndex.hasOwnProperty('hop') ) {
      editing = 'editHop';
    } else if ( editingIndex.hasOwnProperty('adjunct') ) {
      // not currently supported
      // editing = 'editAdjunct';
    } else if ( editingIndex.hasOwnProperty('yeast') ) {
      editing = 'editYeast';
    }
    this.flipTheCard(editing, editingIndex)
  }

  addIngredient(ingredient) {
    let control;
    switch (Object.keys(ingredient)[0]) {
      case 'fermentable':
        control = this.newBrewForm.get('fermentables') as FormArray;
        control.push(this.createFermentable(ingredient));
        break;
      case 'hop':
        control = this.newBrewForm.get('hops') as FormArray;
        control.push(this.createHop(ingredient));
        break;
      case 'adjunct':
        // not supporting adjuncts yet
        break;
      case 'yeast':
        control = this.newBrewForm.get('yeasts') as FormArray;
        control.push(this.createYeast(ingredient));
        break;
    }
  }

  editIngredient(ingredient) {
    let control;
    switch (Object.keys(ingredient)[0]) {
      case 'fermentable':
        control = this.newBrewForm.get('fermentables') as FormArray;
        control.setControl(ingredient.index, this.createFermentable(ingredient));
        break;
      case 'hop':
        control = this.newBrewForm.get('hops') as FormArray;
        control.setControl(ingredient.index, this.createHop(ingredient));
        break;
      case 'adjunct':
        // not supporting adjuncts yet
        break;
      case 'yeast':
        control = this.newBrewForm.get('yeasts') as FormArray;
        control.setControl(ingredient.index, this.createYeast(ingredient));
        break;
    }
  }

  removeIngredient(ingredient) {
    let control;
    switch (ingredient.detail) {
      case 'editFermentable':
        control = this.newBrewForm.get('fermentables') as FormArray;
        break;
      case 'editHop':
        control = this.newBrewForm.get('hops') as FormArray;
        break;
      case 'editAdjunct':
        // not supporting adjuncts yet
        break;
      case 'editYeast':
        control = this.newBrewForm.get('yeasts') as FormArray;
        break;
    }
    control.removeAt(ingredient.index);
    this.closeTheCard();
  }

  getDefaults() {
    return {
      // default batchSize to 6 if there isn't one entered yet
      batchSize: this.newBrewForm.get('brewFormSettings.batchSize').value ? this.newBrewForm.get('brewFormSettings.batchSize').value : 6,
      // default sysEfficiency to 75% if there isn't one entered yet
      batchEffieiency: this.newBrewForm.get('brewFormSettings.sysEfficiency').value ? this.newBrewForm.get('brewFormSettings.sysEfficiency').value : 75,
      // default boilTime to 60 if there isn't one entered yet
      boilTime: this.newBrewForm.get('brewFormBoil.boilTime').value ? this.newBrewForm.get('brewFormBoil.boilTime').value : 60,
      // default pre original gravity to 1.056 if there isn't one entered yet
      originalGravity: this.gravities.originalGravity ? this.gravities.originalGravity : 1.056,
      // default evaporation rate to 1.5 gallons if there isn't one entered yet
      evapRate: this.newBrewForm.get('brewFormBoil.evaporationRate').value ? this.newBrewForm.get('brewFormBoil.evaporationRate').value : 1.5
    }
  }

  getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  ngOnInit() {
    this.userService
      .getUser()
      .subscribe((data: string) => {
        this.userId = data
      });

    this.apollo.watchQuery({
      query: currentUserQuery,
      variables: {
        id: this.userId
      }
    }).subscribe(({data, loading}) => {
      this.currentUser = data['getUser'];
    });

    // watch for changes to the form to calculate certain variables
    this.newBrewForm
      .valueChanges.subscribe(value => {
        // update newBrew
        let control = this.newBrewForm;
        this.newBrew = {
          userId: this.userId,
          batchNum: (this.currentUser.Brews.edges.length)+1,
          strikeTemp: this.strikeTemp,
          mashWaterVol: this.strikeVol,
          spargeWaterVol: this.spargeVol,
          boilWaterVol: this.boilSize,
          preBoilGravity: '' !== this.gravities.preBoilGravity ? this.gravities.preBoilGravity : null,
          originalGravity: '' !== this.gravities.originalGravity ? this.gravities.originalGravity : null,
          finalGravity: '' !== this.gravities.finalGravity ? this.gravities.finalGravity : null,
          name: control.get('brewFormName.name').value,
          batchType: '' !== control.get('brewFormSettings.batchType').value ? control.get('brewFormSettings.batchType').value : null,
          batchSize: '' !== control.get('brewFormSettings.batchSize').value ? control.get('brewFormSettings.batchSize').value : null,
          batchEfficiency: '' !== control.get('brewFormSettings.sysEfficiency').value ? control.get('brewFormSettings.sysEfficiency').value : null,
          mashTemp: '' !== control.get('brewFormMash.targetMashTemp').value ? control.get('brewFormMash.targetMashTemp').value : null,
          mashTime: '' !== control.get('brewFormMash.mashTime').value ? control.get('brewFormMash.mashTime').value : null,
          spargeTemp: '' !== control.get('brewFormMash.spargeTemp').value ? control.get('brewFormMash.spargeTemp').value : null,
          boilTime: '' !== control.get('brewFormBoil.boilTime').value ? control.get('brewFormBoil.boilTime').value : null,
          evaporationRate: '' !== control.get('brewFormBoil.evaporationRate').value ? control.get('brewFormBoil.evaporationRate').value : null,
          fermentTemp: '' !== control.get('brewFormFermentation.fermentTemp').value ? control.get('brewFormFermentation.fermentTemp').value : null,
          fermentTime: '' !== control.get('brewFormFermentation.fermentTime').value ? control.get('brewFormFermentation.fermentTime').value : null,
          fermentSecTemp: '' !== control.get('brewFormFermentation.fermentSecTime').value ? control.get('brewFormFermentation.fermentSecTime').value : null,
          packaging: '' !== control.get('brewFormPackaging.packageType').value ? control.get('brewFormPackaging.packageType').value : null,
          carbonateCo2Vol: '' !== control.get('brewFormPackaging.co2VolTarget').value ? control.get('brewFormPackaging.co2VolTarget').value : null,
          carbonateTemp: '' !== control.get('brewFormPackaging.beerTemp').value ? control.get('brewFormPackaging.beerTemp').value : null,
          carbonateType: '' !== control.get('brewFormPackaging.carbonationMethod').value ? control.get('brewFormPackaging.carbonationMethod').value : null
        }

        let defaults = this.getDefaults();

        if ( 0 < this.newBrewForm.get('fermentables').value.length ) {
          // // calculate original gravity
          this.gravities.originalGravity = this.brewCalcService.calculateOG(this.newBrewForm.get('fermentables').value, defaults.batchEffieiency, defaults.batchSize);

          // calculate pre boil gravity
          this.gravities.preBoilGravity = this.brewCalcService.calculatePreBoilG(this.gravities.originalGravity, defaults.boilTime, defaults.batchSize, defaults.evapRate);

          // calculate pre boil volume
          this.boilSize = this.brewCalcService.caclculatePreBoilVol(defaults.boilTime, defaults.batchSize, defaults.evapRate);
        }

        if ( 0 !== this.newBrewForm.get('yeasts').value.length ) {
          // if more than one yeast, get the highest possible attenuation percentage
          let attenuationsArray: any = [];
          for (let i = 0; i < this.newBrewForm.get('yeasts').value.length; i++) {
            let atten = this.newBrewForm.get('yeasts').value[i].yeast.attenuation.split('-');
            attenuationsArray.push(1 < atten.length ? atten[1] : atten[0]);
          }
          this.attenuationPercent = this.getMaxOfArray(attenuationsArray);

          // calculate final gravity estimate
          this.gravities.finalGravity = this.brewCalcService.calculateFG(defaults.originalGravity, this.attenuationPercent);
        }

        // Strike volume
        this.strikeVol = this.brewCalcService.calculateStrikeVol(this.newBrewForm.value);

        // Strike temperature
        this.strikeTemp = this.brewCalcService.calculateStrikeTemp(this.newBrewForm.get('brewFormMash.waterToGrain').value, this.newBrewForm.get('brewFormMash.initialGrainTemp').value, this.newBrewForm.get('brewFormMash.targetMashTemp').value);

        // Sparge volume
        this.spargeVol = this.brewCalcService.calculateSpargevol(this.strikeVol);

        // TODO: Need to think about sparge type selection

        // Co2
        this.co2 = this.brewCalcService.calculateCO2(this.newBrewForm.get('brewFormPackaging.beerTemp').value, this.newBrewForm.get('brewFormPackaging.co2VolTarget').value, this.newBrewForm.get('brewFormPackaging.carbonationMethod').value, this.newBrewForm.get('brewFormSettings.batchSize').value);
      });
  }

  saveBrew() {
    this.loader = true;
    let control = this.newBrewForm;

    this.apollo.mutate({
      // save brew
      mutation: saveBrewMutation,
      variables: {
        brew: this.newBrew
      }
    }).subscribe(({ data }) => {
      let brewId = data['createBrew'].changedBrew.id;

      // save malt choices
      let fermentables = control.get('fermentables') as FormArray;
      let fermentablesArray = fermentables.getRawValue();
      fermentablesArray.forEach(malt => {
        this.saveMalt(brewId, malt);
      });

      // save hop choices
      let hops = control.get('hops') as FormArray;
      let hopsArray = hops.getRawValue();
      hopsArray.forEach(hop => {
        this.saveHop(brewId, hop);
      });

      // save yeast choices
      let yeasts = control.get('yeasts') as FormArray;
      let yeastsArray = yeasts.getRawValue();
      yeastsArray.forEach(yeast => {
        this.saveYeast(brewId, yeast);
      });

      console.log('got data', data);
      this.modalData = { 
        title: data['createBrew'].changedBrew.name+' saved. Have a homebrew!',
        body: '',
        buttons: { view: true, viewData: brewId, dashboard: true }
      };
      this.showModal = true;

    },(error) => {
      console.log('there was an error sending the query', error);
      this.modalData = { 
        title: 'Boil Over',
        body: 'There was a forge error saving this brew. Please try again later.',
        buttons: { close: true, dashboard: true }
      };
      this.showModal = true;
    });
  }

  saveMalt(brewId, malt) {
    this.apollo.mutate({
      mutation: saveMaltMutation,
      variables: {
        malt: {
          brewId: brewId,
          maltId: malt.fermentableId,
          amount: malt.fermentableWeight
        }
      }
    });
  }

  saveHop(brewId, hop) {
    this.apollo.mutate({
      mutation: saveHopMutation,
      variables: {
        hop: {
          brewId: brewId,
          hopId: hop.hopId,
          amount: hop.hopWeight,
          time: hop.hopTime,
          alphaAcid: hop.hopAlphaAcid
        }
      }
    });
  }

  saveYeast(brewId, yeast) {
    this.apollo.mutate({
      mutation: saveYeastMutation,
      variables: {
        yeast: {
          brewId: brewId,
          yeastId: yeast.yeastId,
          amount: yeast.yeastAmount,
          package: yeast.yeastPackage
        }
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.loader = false;
  }
}
