import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

// Components
import { badgeComponent } from 'app/shared/badge/badge.component';

// Pipes
import { parseMash, ParseCo2Method, FillPipe, round, gravityUnits } from './pipes/brewFilter.pipe';
import { getTotalMalt, getTotalHop, getABV, getSRM, getIBUs, getOriginalGravity, getAttenuation, getCo2 } from './pipes/brewCal.pipe';

// This module is so shared pipes and components can be globally accessible

@NgModule({
  declarations: [
    parseMash,
    ParseCo2Method,
    FillPipe,
    round,
    gravityUnits,
    getTotalMalt,
    getTotalHop,
    getABV,
    getSRM,
    getIBUs,
    getAttenuation,
    getCo2,
    badgeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    parseMash,
    ParseCo2Method,
    FillPipe,
    round,
    gravityUnits,
    getTotalMalt,
    getTotalHop,
    getABV,
    getSRM,
    getIBUs,
    getAttenuation,
    getCo2,
    badgeComponent
  ]
})

export class SharedModule {}
