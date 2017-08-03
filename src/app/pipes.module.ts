import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

// Pipes
import { parseMash, round, gravityUnits } from './pipes/brewFilter.pipe';
import { getTotalMalt, getTotalHop, getABV, getSRM, getIBUs, getOriginalGravity, getAttenuation, getCo2 } from './pipes/brewCal.pipe';

@NgModule({
  declarations: [
    parseMash,
    round,
    gravityUnits,
    getTotalMalt,
    getTotalHop,
    getABV,
    getSRM,
    getIBUs,
    getAttenuation,
    getCo2
  ],
  imports: [
    CommonModule
  ],
  exports: [
    parseMash,
    round,
    gravityUnits,
    getTotalMalt,
    getTotalHop,
    getABV,
    getSRM,
    getIBUs,
    getAttenuation,
    getCo2
  ]
})

export class PipeModule {}
