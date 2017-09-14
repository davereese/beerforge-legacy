import { Pipe, PipeTransform } from '@angular/core';
import { BrewCalcService } from '../services/brewCalc.service';

@Pipe({name: 'getTotalMalt'})
export class getTotalMalt implements PipeTransform {
  constructor(
    private brewCalcService: BrewCalcService
  ) {}

  transform(value: any): string {
    let totalMalt: number = this.brewCalcService.calculateTotalMalt(value);
    return Math.round(totalMalt * 10000) / 10000+' lbs.';
  }
}

@Pipe({name: 'getTotalHop'})
export class getTotalHop implements PipeTransform {
  transform(value: any): string {
    let totalHop: number = 0;
    if ( undefined ===  value.hopChoice ) { // coming from new brew
      for (let index = 0; index < value.hops.length; index++) {
        totalHop += value.hops[index].hopWeight;
      }
    } else { // coming from view brew
      for (let index = 0; index < value.hopChoice.edges.length; index++) {
        totalHop += value.hopChoice.edges[index].node.amount;
      }
    }
    return Math.round(totalHop * 100) / 100+' oz.';
  }
}

@Pipe({name: 'getABV'})
export class getABV implements PipeTransform {
  constructor(
    private brewCalcService: BrewCalcService
  ) {}

  transform(value: any): string {
    let ABV: string = '0% ABV',
        originalGravity,
        finalGravity;
    if (undefined !== value.brewFormAuto) { // coming from new brew
      let originalGravity = value.brewFormAuto.originalGravity,
          finalGravity = value.brewFormAuto.finalGravity;
      if (undefined !== originalGravity && undefined !== finalGravity) {
        ABV = this.brewCalcService.calculateABV(originalGravity, finalGravity)+'% ABV';
      }
    } else { // coming from view brew
      ABV = this.brewCalcService.calculateABV(value.originalGravity, value.finalGravity)+'% ABV';
    }
    return ABV;
  }
}

@Pipe({name: 'getIBUs'})
export class getIBUs implements PipeTransform {
  constructor(
    private brewCalcService: BrewCalcService
  ) {}

  transform(value: any, argument: string): any {
    let IBUs: number = 0,
        hopIBUs: any = [];
    if ( null !== value ) {
      if ( undefined === value.hopChoice ) { // coming from new brew
        // define defaults
        let batchSize = '' !== value.brewFormSettings.batchSize && null !== value.brewFormSettings.batchSize ? value.brewFormSettings.batchSize : 6;
        let preBoilGravity = null !== value.brewFormAuto.preBoilGravity ? value.brewFormAuto.preBoilGravity : 1.056;
        let volume = null !== value.brewFormAuto.boilWaterVol ? batchSize > value.brewFormAuto.boilWaterVol ? batchSize : value.brewFormAuto.boilWaterVol : batchSize;
        for (let index = 0; index < value.hops.length; index++) {
          hopIBUs[index] = this.brewCalcService.calculateIBUs( value.hops[index], volume, preBoilGravity );
          IBUs += hopIBUs[index];
        }
      } else { // coming from view brew
        let volume = value.batchSize > value.boilWaterVol ? value.batchSize : value.boilWaterVol;
        for (let index = 0; index < value.hopChoice.edges.length; index++) {
          hopIBUs[index] = this.brewCalcService.calculateIBUs( value.hopChoice.edges[index].node, volume, value.preBoilGravity );
          IBUs += hopIBUs[index];
        }
      }
    }

    if ( 'total' === argument ) {
      return (Math.round(IBUs * 100 ) / 100) + ' IBU';
    } else if ( 'hop' === argument ) {
      return hopIBUs;
    }
  }
}

@Pipe({name: 'getSRM'})
export class getSRM implements PipeTransform {
  constructor(
    private brewCalcService: BrewCalcService
  ) {}

  transform(value: any): string {
    let SRM: string = '0',
        malts: any,
        batchSize: number;
    if ( null !== value ) {
      if ( undefined ===  value.maltChoice ) { // coming from new brew
        malts = value.fermentables;
        batchSize = value.brewFormSettings.batchSize ? value.brewFormSettings.batchSize : 6;
      } else { // coming from view brew
        malts = value.maltChoice.edges;
        batchSize = value.batchSize;
      }
      SRM = this.brewCalcService.calculateSRM(malts, batchSize)+' SRM';
    }
    return SRM;
  }
}

@Pipe({name: 'getOriginalGravity'})
export class getOriginalGravity implements PipeTransform {
  constructor(
    private brewCalcService: BrewCalcService
  ) {}

  transform(value: any): number {
    // define defaults
    let batchSize = '' !== value.brewFormSettings.batchSize && null !== value.brewFormSettings.batchSize ? value.brewFormSettings.batchSize : 6;
    let batchEffieiency = value.brewFormSettings.sysEfficiency ? value.brewFormSettings.sysEfficiency : 75;
    var OG: number;

    if ( null !== value ) {
      if ( 0 < value.fermentables.length ) {
        OG = parseFloat((this.brewCalcService.calculateOG(value.fermentables, batchEffieiency, batchSize)).toFixed(3));
      } else {
        OG = null;
      }
    }
    return OG;
  }
}

@Pipe({name: 'getAttenuation'})
export class getAttenuation implements PipeTransform {
  constructor(
    private brewCalcService: BrewCalcService
  ) {}

  transform(value: any): string {
    let attenuation: string = '0% Attenuation',
        originalGravity,
        finalGravity;

    if (undefined !== value.brewFormAuto) { // coming from new brew
      originalGravity = null !== value.brewFormAuto.originalGravity ? value.brewFormAuto.originalGravity : 0,
      finalGravity = null !== value.brewFormAuto.finalGravity ? value.brewFormAuto.finalGravity : undefined;
    } else { // coming from view brew
      originalGravity = null !== value.originalGravity ? value.originalGravity : 0,
      finalGravity = null !== value.finalGravity ? value.finalGravity : 0;
    }

    if (undefined !== originalGravity && undefined !== finalGravity && '' !== finalGravity) {
      attenuation = this.brewCalcService.calculateAttenuation(originalGravity, finalGravity)+'% Attenuation';
    }
    return attenuation;
  }
}

@Pipe({name: 'getCo2'})
export class getCo2 implements PipeTransform {
  constructor(
    private brewCalcService: BrewCalcService
  ) {}

  transform(value: any): string {
    let co2;
    if ( undefined ===  value.batchSize ) { // coming from new brew
      co2 = this.brewCalcService.calculateCO2(value.brewFormPackaging.beerTemp, value.brewFormPackaging.co2VolTarget, value.brewFormPackaging.carbonationMethod, value.brewFormSettings.batchSize);
    } else { // coming from view brew
      co2 = this.brewCalcService.calculateCO2(value.carbonateTemp, value.carbonateCo2Vol, value.carbonateType, value.batchSize);
    }
    return co2;
  }
}
