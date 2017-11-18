import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {
  saveBrewMutation,
  deleteBrewMutation,
  saveMaltMutation,
  saveHopMutation,
  saveYeastMutation,
  updateBrewMutation,
  updateMaltMutation,
  updateHopMutation,
  updateYeastMutation,
  deleteMaltMutation,
  deleteHopMutation,
  deleteYeastMutation
} from '../brew/models/saveBrew.model';
import { modalData } from '../modal/models/modal.model';
import gql from 'graphql-tag';
import { Brew } from '../brew/models/brew.interface';

import { BrewCalcService } from './brewCalc.service';

@Injectable()
export class BrewFormService {
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
        batchType: (null !== brewData ? null !== brewData.batchType ? brewData.batchType : '' : ''),
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
        waterToGrain: (null !== brewData ? brewData.waterToGrain : null),
        initialGrainTemp: (null !== brewData ? brewData.initialGrainTemp : null),
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
        packageType: (null !== brewData ? brewData.packaging : ''),
        carbonationMethod: (null !== brewData ? brewData.carbonateType : ''),
        co2VolTarget: (null !== brewData ? brewData.carbonateCo2Vol : null),
        beerTemp: (null !== brewData ? brewData.carbonateTemp : null),
      }),
      brewFormNotes: this.fb.group({
        notes: (null !== brewData ? brewData.notes : '' ),
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
          fermentableWeight: maltChoice.node.amount,
        }
        const control = brewForm.get('fermentables') as FormArray;
        control.push(this.createFermentable(fermentable, maltChoice.node.id));
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
        control.push(this.createHop(hop, hopChoice.node.id));
      });

      brewData.yeastChoice.edges.forEach(yeastChoice => {
        const yeast = {
          yeast: yeastChoice.node.yeast,
          yeastId: yeastChoice.node.yeast.id,
          yeastAmount: yeastChoice.node.amount,
          yeastPackage:  yeastChoice.node.package
        }
        const control = brewForm.get('yeasts') as FormArray;
        control.push(this.createYeast(yeast, yeastChoice.node.id));
      });
    }

    this.newBrewForm.next(brewForm);
  }

  createFermentable(fermentable, choiceID = null) {
    return this.fb.group({
      fermentable: (fermentable.fermentable || ''),
      fermentableId: (fermentable.fermentableId || ''),
      fermentableWeight: (fermentable.fermentableWeight || null),
      choiceID: choiceID
    });
  }

  createHop(hop, choiceID = null) {
    return this.fb.group({
      hop: (hop.hop || ''),
      hopId: (hop.hopId || ''),
      hopAlphaAcid: (hop.hopAlphaAcid || null),
      hopTime: (0 === hop.hopTime ? 0 : hop.hopTime || null),
      hopWeight: (hop.hopWeight || null),
      choiceID: choiceID
    });
  }

  createAdjunct(adjunct, choiceID = null) {
    return this.fb.group({
      adjunct: (adjunct.adjunct || ''),
      adjunctId: (adjunct.adjunctId || ''),
      adjunctWeight: (adjunct.adjunctWeight || null),
      choiceID: choiceID
    });
  }

  createYeast(yeast, choiceID = null) {
    return this.fb.group({
      yeast: (yeast.yeast || ''),
      yeastId: (yeast.yeastId || ''),
      yeastPackage: (yeast.yeastPackage || ''),
      yeastAmount: (yeast.yeastAmount || null),
      choiceID: choiceID
    });
  }

  addUserInfo(userId: string, brews) {
    let batchNum: number;
    if (0 === brews.length) {
      batchNum = 1;
    } else {
      batchNum = brews[0].batchNum;
    }

    this.newBrewForm.value.get('brewFormAuto').patchValue({
      userId: (null !== userId ? userId : null),
      batchNum: (null !== brews ? (batchNum)+1 : null)
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
    let choiceID;
    switch (Object.keys(ingredient)[0]) {
      case 'fermentable':
        control = this.newBrewForm.value.get('fermentables') as FormArray;
        choiceID = control.value[ingredient.index].choiceID
        control.setControl(ingredient.index, this.createFermentable(ingredient, choiceID));
        break;
      case 'hop':
        control = this.newBrewForm.value.get('hops') as FormArray;
        choiceID = control.value[ingredient.index].choiceID
        control.setControl(ingredient.index, this.createHop(ingredient, choiceID));
        break;
      case 'adjunct':
        // not supporting adjuncts yet
        break;
      case 'yeast':
        control = this.newBrewForm.value.get('yeasts') as FormArray;
        choiceID = control.value[ingredient.index].choiceID
        control.setControl(ingredient.index, this.createYeast(ingredient, choiceID));
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
  
  updateCalculations(currentBrew = null) {
    const defaults = this.getDefaults();
    const og = this.brewCalcService.calculateOG(this.newBrewForm.value.get('fermentables').value, defaults.batchEffieiency, defaults.batchSize);

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

    // calculate brewFormAuto values
    const mashWaterVol = this.brewCalcService.calculateStrikeVol(this.newBrewForm.value.value);
    const spargeWaterVol = this.brewCalcService.calculateSpargevol(mashWaterVol);
    const strikeTemp = this.brewCalcService.calculateStrikeTemp(this.newBrewForm.value.get('brewFormMash.waterToGrain').value, this.newBrewForm.value.get('brewFormMash.initialGrainTemp').value, this.newBrewForm.value.get('brewFormMash.targetMashTemp').value);

    this.newBrewForm.value.get('brewFormAuto').patchValue({
      // Strike volume
      mashWaterVol: 0 === mashWaterVol ? null !== currentBrew ? currentBrew.mashWaterVol : mashWaterVol : mashWaterVol,
      // Strike temperature
      strikeTemp: Infinity === strikeTemp ? null !== currentBrew ? currentBrew.strikeTemp : strikeTemp : strikeTemp,
      // Sparge volume
      spargeWaterVol: 0 === spargeWaterVol ? null !== currentBrew ? currentBrew.spargeWaterVol : spargeWaterVol : spargeWaterVol
    });

    // TODO: Need to think about sparge type selection

    // Co2
    this.co2 = this.brewCalcService.calculateCO2(this.newBrewForm.value.get('brewFormPackaging.beerTemp').value, this.newBrewForm.value.get('brewFormPackaging.co2VolTarget').value, this.newBrewForm.value.get('brewFormPackaging.carbonationMethod').value, this.newBrewForm.value.get('brewFormSettings.batchSize').value);
  }

  compareMalts(malt, maltChoice) {
    // false if they are different
    // true if they are the same
    let result: boolean = false;
    if (malt.fermentableId === maltChoice.malt.id && malt.fermentableWeight === maltChoice.amount) {
      result = true;
    }
    return result;
  }

  compareHops(hop, hopChoice) {
    // false if they are different
    // true if they are the same
    let result: boolean = false;
    if (hop.hopId === hopChoice.hop.id && hop.hopAlphaAcid === hopChoice.alphaAcid && hop.hopTime === hopChoice.time && hop.hopWeight === hopChoice.amount) {
      result = true;
    }
    return result;
  }

  compareYeasts(yeast, yeastChoice) {
    // false if they are different
    // true if they are the same
    let result: boolean = false;
    if (yeast.yeastId === yeastChoice.yeast.id && yeast.yeastAmount === yeastChoice.amount && yeast.yeastPackage === yeastChoice.package) {
      result = true;
    }
    return result;
  }

  saveBrew(currentBrew?, callback?) {
    let update: boolean = false;
    const control = this.newBrewForm.value;
    const brew: any = {
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
      batchType: '' !== control.get('brewFormSettings.batchType').value ? control.get('brewFormSettings.batchType').value : null ,
      batchSize: control.get('brewFormSettings.batchSize').value,
      batchEfficiency: control.get('brewFormSettings.sysEfficiency').value,
      waterToGrain: control.get('brewFormMash.waterToGrain').value,
      initialGrainTemp: control.get('brewFormMash.initialGrainTemp').value,
      mashTemp: control.get('brewFormMash.targetMashTemp').value,
      mashTime: control.get('brewFormMash.mashTime').value,
      spargeTemp: control.get('brewFormMash.spargeTemp').value,
      boilTime: control.get('brewFormBoil.boilTime').value,
      evaporationRate: control.get('brewFormBoil.evaporationRate').value,
      fermentTemp: control.get('brewFormFermentation.fermentTemp').value,
      fermentTime: control.get('brewFormFermentation.fermentTime').value,
      fermentSecTemp: control.get('brewFormFermentation.fermentSecTime').value,
      packaging: '' !== control.get('brewFormPackaging.packageType').value ? control.get('brewFormPackaging.packageType').value : null,
      carbonateCo2Vol: control.get('brewFormPackaging.co2VolTarget').value,
      carbonateTemp: control.get('brewFormPackaging.beerTemp').value,
      carbonateType: '' !== control.get('brewFormPackaging.carbonationMethod').value ? control.get('brewFormPackaging.carbonationMethod').value : null,
      notes: '' !== control.get('brewFormNotes.notes').value ? control.get('brewFormNotes.notes').value : null
    };
    if (null !== currentBrew) {
      brew.id = currentBrew.id;
      update = true;
    }

    this.apollo.use('auth').mutate({
      // save brew
      mutation: false === update ? saveBrewMutation : updateBrewMutation,
      variables: {
        brew: brew
      }
    }).subscribe(({ data }) => {
      const brewId = data['createBrew'] ? data['createBrew'].changedBrew.id : data['updateBrew'] ? data['updateBrew'].changedBrew.id : null;

      // save malt choices
      const fermentables = control.get('fermentables') as FormArray;
      const fermentablesArray = fermentables.getRawValue();

      if (null !== currentBrew) {
        // loop through old data to compage against what has been edited
        currentBrew.maltChoice.edges.forEach(maltChoice => {
          const choiceID = maltChoice.node.id;
          let doNotDelete: boolean = false;
          fermentablesArray.forEach(malt => {
            if (malt.choiceID === choiceID) {
              doNotDelete = true;
              if (false === this.compareMalts(malt, maltChoice.node)) {
                this.saveMalt(brewId, malt, true); // update
              }
            }
          });
          if (false === doNotDelete) {
            this.deleteMalt(choiceID);
          }
        });
      }
      // then loop over fermentables array again for any new malts
      fermentablesArray.forEach(malt => {
        if (malt.choiceID === null) {
          this.saveMalt(brewId, malt, false); // save
        }
      });

      // save hop choices
      const hops = control.get('hops') as FormArray;
      const hopsArray = hops.getRawValue();

      if (null !== currentBrew) {
        currentBrew.hopChoice.edges.forEach(hopChoice => {
          const choiceID = hopChoice.node.id;
          let doNotDelete: boolean = false;
          hopsArray.forEach(hop => {
            if (hop.choiceID === choiceID) {
              doNotDelete = true;
              if (false === this.compareHops(hop, hopChoice.node)) {
                this.saveHop(brewId, hop, true); // update
              }
            }
          });
          if (false === doNotDelete) {
            this.deleteHop(choiceID);
          }
        });
      }
      // then loop over fermentables array again for any new malts
      hopsArray.forEach(hop => {
        if (hop.choiceID === null) {
          this.saveHop(brewId, hop, false); // save
        }
      });

      // save yeast choices
      const yeasts = control.get('yeasts') as FormArray;
      const yeastsArray = yeasts.getRawValue();

      if (null !== currentBrew) {
        currentBrew.yeastChoice.edges.forEach(yeastChoice => {
          const choiceID = yeastChoice.node.id;
          let doNotDelete: boolean = false;
          yeastsArray.forEach(yeast => {
            if (yeast.choiceID === choiceID) {
              doNotDelete = true;
              if (false === this.compareYeasts(yeast, yeastChoice.node)) {
                this.saveYeast(brewId, yeast, true); // update
              }
            }
          });
          if (false === doNotDelete) {
            this.deleteYeast(choiceID);
          }
        });
      }
      // then loop over fermentables array again for any new malts
      yeastsArray.forEach(yeast => {
        if (yeast.choiceID === null) {
          this.saveYeast(brewId, yeast, false); // save
        }
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

  deleteBrew(currentBrew, callback?) {
    this.apollo.use('auth').mutate({
      mutation: deleteBrewMutation,
      variables: {
        brewId: { id: currentBrew.id }
      }
    }).subscribe(({ data }) => {
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

  saveMalt(brewId, malt, update?) {
    const maltData: any = {
      brewId: brewId,
      maltId: malt.fermentableId,
      amount: malt.fermentableWeight
    }
    if (true === update) {
      maltData.id = malt.choiceID
    }
    this.apollo.use('auth').mutate({
      mutation: false === update ? saveMaltMutation : updateMaltMutation,
      variables: {
        malt: maltData
      }
    });
  }

  deleteMalt(choiceID) {
    this.apollo.use('auth').mutate({
      mutation: deleteMaltMutation,
      variables: {
        choiceID: { id: choiceID }
      }
    });
  }

  saveHop(brewId, hop, update?) {
    const hopData: any = {
      brewId: brewId,
      hopId: hop.hopId,
      amount: hop.hopWeight,
      time: hop.hopTime,
      alphaAcid: hop.hopAlphaAcid
    }
    if (true === update) {
      hopData.id = hop.choiceID
    }
    this.apollo.use('auth').mutate({
      mutation: false === update ? saveHopMutation : updateHopMutation,
      variables: {
        hop: hopData
      }
    });
  }

  deleteHop(choiceID) {
    this.apollo.use('auth').mutate({
      mutation: deleteHopMutation,
      variables: {
        choiceID: { id: choiceID }
      }
    });
  }

  saveYeast(brewId, yeast, update?) {
    const yeastData: any = {
      brewId: brewId,
      yeastId: yeast.yeastId,
      amount: yeast.yeastAmount,
      package: yeast.yeastPackage
    }
    if (true === update) {
      yeastData.id = yeast.choiceID
    }
    this.apollo.use('auth').mutate({
      mutation: false === update ? saveYeastMutation : updateYeastMutation,
      variables: {
        yeast: yeastData
      }
    });
  }

  deleteYeast(choiceID) {
    this.apollo.use('auth').mutate({
      mutation: deleteYeastMutation,
      variables: {
        choiceID: { id: choiceID }
      }
    });
  }
}
