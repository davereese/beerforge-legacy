import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { saveBrewMutation } from '../brew/models/saveBrew.model';
import { saveMaltMutation } from '../brew/models/saveBrew.model';
import { saveHopMutation } from '../brew/models/saveBrew.model';
import { saveYeastMutation } from '../brew/models/saveBrew.model';
import { modalData } from '../modal/models/modal.model';
import gql from 'graphql-tag';
import { Brew } from '../brew/models/brew.interface';

import { BrewCalcService } from './brewCalc.service';

@Injectable()
export class BrewFormService {
  // newBrew: Brew;
  strikeVol: number = 0;
  strikeTemp: number = 0;
  spargeVol: number = 0;
  boilSize: number = 0;
  attenuationPercent: number = 0; // used to record the highest selected yeast attenuation %
  co2: string;
  gravities: any = {};
  newBrewForm: BehaviorSubject<FormGroup>;

  constructor(
    private fb: FormBuilder,
    private brewCalcService: BrewCalcService,
    private apollo: Apollo,
  ) {
    this.newBrewForm = <BehaviorSubject<FormGroup>>new BehaviorSubject(null);
  }

  loadForm(brewData = null) {
    const brewForm = this.fb.group({
      brewFormName: this.fb.group({
        name: (null !== brewData ? brewData.name : 'New Brew' ),
      }),
      brewFormSettings: this.fb.group({
        batchType: (null !== brewData ? brewData.batchType : null),
        batchSize: (null !== brewData ? brewData.batchSize : null),
        sysEfficiency: (null !== brewData ? brewData.batchEfficiency : null),
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
        targetMashTemp: (null !== brewData ? brewData.mashTemp : null),
        waterToGrain: (''),
        initialGrainTemp: (''),
        mashTime: (null !== brewData ? brewData.mashTime : null),
        spargeTemp: (null !== brewData ? brewData.spargeTemp : null),
      }),
      brewFormBoil: this.fb.group({
        boilTime: (null !== brewData ? brewData.boilTime : null),
        evaporationRate: (null !== brewData ? brewData.evaporationRate : null),
      }),
      brewFormFermentation: this.fb.group({
        fermentTime: (null !== brewData ? brewData.fermentTime : null),
        fermentTemp: (null !== brewData ? brewData.fermentTemp : null),
        fermentSecCheck: (false),
        fermentSecTime: (null !== brewData ? brewData.fermentSecTime : null),
        fermentSecTemp: (null !== brewData ? brewData.fermentSecTemp : null),
      }),
      brewFormPackaging: this.fb.group({
        packageType: (null !== brewData ? brewData.packaging : null),
        carbonationMethod: (null !== brewData ? brewData.carbonateType : null),
        co2VolTarget: (null !== brewData ? brewData.carbonateCo2Vol : null),
        beerTemp: (null !== brewData ? brewData.carbonateTemp : null),
      }),
      // auto generated and calculated values
      brewFormAuto: this.fb.group({
        userId: (null !== brewData ? brewData.User.id : ''),
        batchNum: (null !== brewData ? brewData.batchNum : null),
        strikeTemp: (null !== brewData ? brewData.strikeTemp : null),
        mashWaterVol: (null !== brewData ? brewData.mashWaterVol : null),
        spargeWaterVol: (null !== brewData ? brewData.spargeWaterVol : null),
        boilWaterVol: (null !== brewData ? brewData.boilWaterVol : null),
        preBoilGravity: (null !== brewData ? brewData.preBoilGravity : null),
        originalGravity: (null !== brewData ? brewData.originalGravity : null),
        finalGravity: (null !== brewData ? brewData.finalGravity : null),
      })
    })

    if (null !== brewData) {
      brewData.maltChoice.edges.forEach(maltChoice => {
        const fermentable = {
          fermentable: maltChoice.node.malt,
          fermentableId: maltChoice.node.malt.id,
          fermentableWeight: maltChoice.node.amount
        }
        const control = brewForm.get('fermentables') as FormArray;
        control.push(this.createFermentable(fermentable));
      });

      brewData.hopChoice.edges.forEach(hopChoice => {
        const hop = {
          hop: hopChoice.node.hop,
          hopId: hopChoice.node.hop.id,
          hopAlphaAcid: hopChoice.node.alphaAcid,
          hopTime: hopChoice.node.time,
          hopWeight: hopChoice.node.amount
        }
        const control = brewForm.get('hops') as FormArray;
        control.push(this.createHop(hop));
      });

      brewData.yeastChoice.edges.forEach(yeastChoice => {
        const yeast = {
          yeast: yeastChoice.node.yeast,
          yeastId: yeastChoice.node.yeast.id,
          yeastAmount: yeastChoice.node.amount,
          yeastPackage:  yeastChoice.node.package
        }
        const control = brewForm.get('yeasts') as FormArray;
        control.push(this.createYeast(yeast));
      });
    }

    this.newBrewForm.next(brewForm);
  }

  createFermentable(fermentable) {
    return this.fb.group({
      fermentable: (fermentable.fermentable || ''),
      fermentableId: (fermentable.fermentableId || ''),
      fermentableWeight: (fermentable.fermentableWeight || null)
    });
  }

  createHop(hop) {
    return this.fb.group({
      hop: (hop.hop || ''),
      hopId: (hop.hopId || ''),
      hopAlphaAcid: (hop.hopAlphaAcid || null),
      hopTime: (0 === hop.hopTime ? 0 : hop.hopTime || null),
      hopWeight: (hop.hopWeight || null)
    });
  }

  createAdjunct(adjunct) {
    return this.fb.group({
      adjunct: (adjunct.adjunct || ''),
      adjunctId: (adjunct.adjunctId || ''),
      adjunctWeight: (adjunct.adjunctWeight || null)
    });
  }

  createYeast(yeast) {
    return this.fb.group({
      yeast: (yeast.yeast || ''),
      yeastId: (yeast.yeastId || ''),
      yeastPackage: (yeast.yeastPackage || ''),
      yeastAmount: (yeast.yeastAmount || null)
    });
  }

  addUserInfo(userId: string, currentUser) {
    this.newBrewForm.value.get('brewFormAuto').patchValue({
      userId: (null !== userId ? userId : null),
      batchNum: (null !== currentUser ? (currentUser.Brews.edges.length)+1 : null)
    });
  }

  addIngredient(ingredient) {
    let control;
    switch (Object.keys(ingredient)[0]) {
      case 'fermentable':
        control = this.newBrewForm.value.get('fermentables') as FormArray;
        control.push(this.createFermentable(ingredient));
        break;
      case 'hop':
        control = this.newBrewForm.value.get('hops') as FormArray;
        control.push(this.createHop(ingredient));
        break;
      case 'adjunct':
        // not supporting adjuncts yet
        break;
      case 'yeast':
        control = this.newBrewForm.value.get('yeasts') as FormArray;
        control.push(this.createYeast(ingredient));
        break;
    }
  }

  editIngredient(ingredient) {
    let control;
    switch (Object.keys(ingredient)[0]) {
      case 'fermentable':
        control = this.newBrewForm.value.get('fermentables') as FormArray;
        control.setControl(ingredient.index, this.createFermentable(ingredient));
        break;
      case 'hop':
        control = this.newBrewForm.value.get('hops') as FormArray;
        control.setControl(ingredient.index, this.createHop(ingredient));
        break;
      case 'adjunct':
        // not supporting adjuncts yet
        break;
      case 'yeast':
        control = this.newBrewForm.value.get('yeasts') as FormArray;
        control.setControl(ingredient.index, this.createYeast(ingredient));
        break;
    }
  }

  removeIngredient(ingredient) {
    let control;
    switch (ingredient.detail) {
      case 'editFermentable':
        control = this.newBrewForm.value.get('fermentables') as FormArray;
        break;
      case 'editHop':
        control = this.newBrewForm.value.get('hops') as FormArray;
        break;
      case 'editAdjunct':
        // not supporting adjuncts yet
        break;
      case 'editYeast':
        control = this.newBrewForm.value.get('yeasts') as FormArray;
        break;
    }
    control.removeAt(ingredient.index);
  }

  getDefaults() {
    return {
      // default batchSize to 6 if there isn't one entered yet
      batchSize: this.newBrewForm.value.get('brewFormSettings.batchSize').value ? this.newBrewForm.value.get('brewFormSettings.batchSize').value : 6,
      // default sysEfficiency to 75% if there isn't one entered yet
      batchEffieiency: this.newBrewForm.value.get('brewFormSettings.sysEfficiency').value ? this.newBrewForm.value.get('brewFormSettings.sysEfficiency').value : 75,
      // default boilTime to 60 if there isn't one entered yet
      boilTime: this.newBrewForm.value.get('brewFormBoil.boilTime').value ? this.newBrewForm.value.get('brewFormBoil.boilTime').value : 60,
      // default pre original gravity to 1.056 if there isn't one entered yet
      originalGravity: this.newBrewForm.value.get('brewFormAuto.originalGravity').value ? this.newBrewForm.value.get('brewFormAuto.originalGravity').value : 1.056,
      // default evaporation rate to 1.5 gallons if there isn't one entered yet
      evapRate: this.newBrewForm.value.get('brewFormBoil.evaporationRate').value ? this.newBrewForm.value.get('brewFormBoil.evaporationRate').value : 1.5
    }
  }

  getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }
  
  updateCalculations() {
    let defaults = this.getDefaults();
    let og = this.brewCalcService.calculateOG(this.newBrewForm.value.get('fermentables').value, defaults.batchEffieiency, defaults.batchSize);

    if ( 0 < this.newBrewForm.value.get('fermentables').value.length ) {
      this.newBrewForm.value.get('brewFormAuto').patchValue({
        // calculate original gravity
        originalGravity: (og),
        // calculate pre boil gravity
        preBoilGravity: (this.brewCalcService.calculatePreBoilG(og, defaults.boilTime, defaults.batchSize, defaults.evapRate)),
        // calculate pre boil volume
        boilWaterVol: (this.brewCalcService.caclculatePreBoilVol(defaults.boilTime, defaults.batchSize, defaults.evapRate))
      });
    }

    if ( 0 !== this.newBrewForm.value.get('yeasts').value.length ) {
      // if more than one yeast, get the highest possible attenuation percentage
      let attenuationsArray: any = [];
      for (let i = 0; i < this.newBrewForm.value.get('yeasts').value.length; i++) {
        let atten = this.newBrewForm.value.get('yeasts').value[i].yeast.attenuation.split('-');
        attenuationsArray.push(1 < atten.length ? atten[1] : atten[0]);
      }
      this.attenuationPercent = this.getMaxOfArray(attenuationsArray);

      this.newBrewForm.value.get('brewFormAuto').patchValue({
        // calculate final gravity estimate
        finalGravity: (this.brewCalcService.calculateFG(defaults.originalGravity, this.attenuationPercent))
      });
    }

    this.newBrewForm.value.get('brewFormAuto').patchValue({
      // Strike volume
      mashWaterVol: (this.brewCalcService.calculateStrikeVol(this.newBrewForm.value.value)),
      // Strike temperature
      strikeTemp: (this.brewCalcService.calculateStrikeTemp(this.newBrewForm.value.get('brewFormMash.waterToGrain').value, this.newBrewForm.value.get('brewFormMash.initialGrainTemp').value, this.newBrewForm.value.get('brewFormMash.targetMashTemp').value)),
      // Sparge volume
      spargeWaterVol: (this.brewCalcService.calculateSpargevol(this.newBrewForm.value.get('brewFormAuto.mashWaterVol').value))
    });

    // TODO: Need to think about sparge type selection

    // Co2
    this.co2 = this.brewCalcService.calculateCO2(this.newBrewForm.value.get('brewFormPackaging.beerTemp').value, this.newBrewForm.value.get('brewFormPackaging.co2VolTarget').value, this.newBrewForm.value.get('brewFormPackaging.carbonationMethod').value, this.newBrewForm.value.get('brewFormSettings.batchSize').value);
  }

  saveBrew(callback?) {
    const control = this.newBrewForm.value;

    this.apollo.mutate({
      // save brew
      mutation: saveBrewMutation,
      variables: {
        brew: {
          userId: control.get('brewFormAuto.userId').value,
          batchNum: control.get('brewFormAuto.batchNum').value,
          strikeTemp: control.get('brewFormAuto.strikeTemp').value,
          mashWaterVol: control.get('brewFormAuto.mashWaterVol').value,
          spargeWaterVol: control.get('brewFormAuto.spargeWaterVol').value,
          boilWaterVol: control.get('brewFormAuto.boilWaterVol').value,
          preBoilGravity: control.get('brewFormAuto.preBoilGravity').value,
          originalGravity: control.get('brewFormAuto.originalGravity').value,
          finalGravity: control.get('brewFormAuto.finalGravity').value,
          name: control.get('brewFormName.name').value,
          batchType: control.get('brewFormSettings.batchType').value,
          batchSize: control.get('brewFormSettings.batchSize').value,
          batchEfficiency: control.get('brewFormSettings.sysEfficiency').value,
          mashTemp: control.get('brewFormMash.targetMashTemp').value,
          mashTime: control.get('brewFormMash.mashTime').value,
          spargeTemp: control.get('brewFormMash.spargeTemp').value,
          boilTime: control.get('brewFormBoil.boilTime').value,
          evaporationRate: control.get('brewFormBoil.evaporationRate').value,
          fermentTemp: control.get('brewFormFermentation.fermentTemp').value,
          fermentTime: control.get('brewFormFermentation.fermentTime').value,
          fermentSecTemp: control.get('brewFormFermentation.fermentSecTime').value,
          packaging: control.get('brewFormPackaging.packageType').value,
          carbonateCo2Vol: control.get('brewFormPackaging.co2VolTarget').value,
          carbonateTemp: control.get('brewFormPackaging.beerTemp').value,
          carbonateType: control.get('brewFormPackaging.carbonationMethod').value
        }
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
      if (callback) {
        callback(data);
      }

    },(error) => {
      console.log('there was an error sending the query', error);
      if (callback) {
        callback(error);
      }
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
}
