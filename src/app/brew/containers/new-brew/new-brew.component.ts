import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Brew } from '../../models/brew.interface';
import { UserService } from '../../../user.service';
import { BrewCalcService } from '../../services/brewCalc.service';

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
    ])
  ]
})
export class newBrewComponent implements OnInit {
  userId: string;
  brewName: string = 'New Brew';
  editingName: boolean = false;
  editingData: any = {};
  flipCard: boolean = false;
  editingSection: string;
  totalMalt: number = 0;
  totalHop: number = 0;
  hopIBUs: any = [];
  totalIBUs: number = 0;
  totalSRM: number = 0;
  strikeVol: number = 0;
  strikeTemp: number = 0;
  spargeVol: number = 0;
  co2: number = 0;
  abv: number = 0;
  attenuation: number = 0;
  attenuationPercent: number = 0; // used to record the highest selected yeast attenuation %

  constructor(
    private fb: FormBuilder,
    private brewCalcService: BrewCalcService,
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
    }),
    brewFormGravities: this.fb.group({
      preBoilGravity: (''),
      originalGravity: (''),
      finalGravity: (''),
    }),
  })
  
  createFermentable(fermentable) {
    return this.fb.group({
      fermentable: (fermentable.fermentable || ''),
      fermentableWeight: (fermentable.fermentableWeight || '')
    });
  }

  createHop(hop) {
    return this.fb.group({
      hop: (hop.hop || ''),
      hopAlphaAcid: (hop.hopAlphaAcid || ''),
      hopTime: (0 === hop.hopTime ? 0 : hop.hopTime || ''),
      hopWeight: (hop.hopWeight || '')
    });
  }

  createAdjunct(adjunct) {
    return this.fb.group({
      adjunct: (adjunct.adjunct || ''),
      adjunctWeight: (adjunct.adjunctWeight || '')
    });
  }

  createYeast(yeast) {
    return this.fb.group({
      yeast: (yeast.yeast || ''),
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

  editingSelection(editingIndex) {
    let editing: string;
    if ( editingIndex.hasOwnProperty('malt') ) {
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
      batchSize: this.newBrewForm.get('brewFormSettings').value.batchSize ? this.newBrewForm.get('brewFormSettings').value.batchSize : 6,
      // default sysEfficiency to 75% if there isn't one entered yet
      batchEffieiency: this.newBrewForm.get('brewFormSettings').value.sysEfficiency ? this.newBrewForm.get('brewFormSettings').value.sysEfficiency : 75,
      // default boilTime to 60 if there isn't one entered yet
      boilTime: this.newBrewForm.get('brewFormBoil').value.boilTime ? this.newBrewForm.get('brewFormBoil').value.boilTime : 60,
      // default pre boil gravity to 1.050 if there isn't one entered yet
      preBoilGravity: this.newBrewForm.get('brewFormGravities').value.preBoilGravity ? this.newBrewForm.get('brewFormGravities').value.preBoilGravity : 1.050
    }
  }

  getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  calculateFermentableStats(selectedFermentables) {
    // calculate total malt
    this.totalMalt = 0;
    for (let i = 0; i < selectedFermentables.length; i++) {
      this.totalMalt += parseInt(selectedFermentables[i].fermentableWeight);
    }

    let defaults = this.getDefaults();

    // calculate SRM
    this.totalSRM = this.brewCalcService.calculateSRM(selectedFermentables, defaults.batchSize);

    if ( 0 < selectedFermentables.length ) {
      // calculate OG
      this.newBrewForm.get('brewFormGravities').patchValue({
        originalGravity: (this.brewCalcService.calculateOG(selectedFermentables, defaults.batchEffieiency, defaults.batchSize)).toFixed(3)
      });

      let evapRate = this.newBrewForm.get('brewFormBoil').value.evaporationRate ? this.newBrewForm.get('brewFormBoil').value.evaporationRate : 1.5;

      // calculate pre boil gravity
      this.newBrewForm.get('brewFormGravities').patchValue({
        preBoilGravity: (this.brewCalcService.calculatePreBoilG(this.newBrewForm.get('brewFormGravities').value.originalGravity, defaults.boilTime, defaults.batchSize, evapRate)).toFixed(3)
      });

      // calculate pre boil volume
      this.newBrewForm.get('brewFormBoil').patchValue({
        boilSize: this.brewCalcService.caclculatePreBoilVol(defaults.boilTime, defaults.batchSize, evapRate)
      });
    }

    // update other sections that depend on variables changed above
    this.newBrewForm.get('brewFormGravities.originalGravity')
      .valueChanges.subscribe(value => {
        if ( 0 < this.newBrewForm.get('yeasts').value.length ) {
          this.calculateYeastStats(null, value);
        }
      });
  }

  calculateHopStats(selectedHops) {
    let defaults = this.getDefaults(),
        boilSize = this.newBrewForm.get('brewFormBoil').value.boilSize;

    // calculate total hop
    this.totalHop = 0;
    this.totalIBUs = 0;
    for (let i = 0; i < selectedHops.length; i++) {
      // calculate individual and total IBUs
      let volume = defaults.batchSize > boilSize ? defaults.batchSize : boilSize;
      this.hopIBUs[i] = this.brewCalcService.calculateIBUs( selectedHops[i], volume, defaults.preBoilGravity );

      this.totalIBUs += this.hopIBUs[i];
      this.totalHop += parseInt(selectedHops[i].hopWeight);
    }
  }

  calculateYeastStats(selectedYeasts = null, OG = null) {
    if ( null !== selectedYeasts ) {
      // if more than one yeast, get the highest possible attenuation %
      let attenuationsArray: any = [];
      for (let i = 0; i < selectedYeasts.length; i++) {
        let atten = selectedYeasts[i].attenuation.split('-');
        attenuationsArray.push(1 < atten.length ? atten[1] : atten[0]);
      }

      this.attenuationPercent = this.getMaxOfArray(attenuationsArray);
    }

    let oGravity = null === OG ? this.newBrewForm.get('brewFormGravities').value.originalGravity : OG;

    // calculate final gravity estimate
    this.newBrewForm.get('brewFormGravities').patchValue({
      finalGravity: (this.brewCalcService.calculateFG(oGravity, this.attenuationPercent)).toFixed(3)
    });

    this.attenuation = this.brewCalcService.calculateAttenuation(oGravity, this.newBrewForm.get('brewFormGravities').value.finalGravity);

    // calculate ABV
    this.abv = this.brewCalcService.calculateABV(oGravity, this.newBrewForm.get('brewFormGravities').value.finalGravity);
  }

  ngOnInit() {
    // watch for changes to the form to calculate mash and carbonation variables
    this.newBrewForm
      .valueChanges.subscribe(value => {
        this.strikeVol = this.brewCalcService.calculateStrikeVol(this.newBrewForm.get('brewFormMash').value.waterToGrain, this.totalMalt);
        this.strikeTemp = this.brewCalcService.calculateStrikeTemp(this.newBrewForm.get('brewFormMash').value.waterToGrain, this.newBrewForm.get('brewFormMash').value.initialGrainTemp, this.newBrewForm.get('brewFormMash').value.targetMashTemp);
        this.spargeVol = this.brewCalcService.calculateSpargevol(this.strikeVol);

        // TODO: calculate CO2 if carbonateType is something other than forced
        this.co2 = this.brewCalcService.calculateCO2(this.newBrewForm.get('brewFormPackaging').value.beerTemp, this.newBrewForm.get('brewFormPackaging').value.co2VolTarget, this.newBrewForm.get('brewFormPackaging').value.carbonationMethod);
      });

    this.newBrewForm.get('brewFormBoil.evaporationRate')
      .valueChanges.subscribe(value => {
        let defaults = this.getDefaults();
        this.newBrewForm.get('brewFormBoil').patchValue({
          boilSize: this.brewCalcService.caclculatePreBoilVol(defaults.boilTime, defaults.batchSize, this.newBrewForm.get('brewFormBoil').value.evaporationRate),
        });
      });
  }
}
