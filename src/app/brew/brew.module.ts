import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { scaphold } from '../../../scaphold/scaphold';

import { loaderModule } from '../loader/loader.module';

import { FocusDirective } from './directives/focus.directive';
import { parseMash, round } from './models/brew-filter.pipe';

// containers
import { viewBrewComponent } from './containers/view-brew/view-brew.component';
import { newBrewComponent } from './containers/new-brew/new-brew.component';

// components
import { fermentableComponent } from './components/fermentable/fermentable.component';
import { hopComponent } from './components/hop/hop.component';
import { adjunctComponent } from './components/adjunct/adjunct.component';
import { yeastComponent } from './components/yeast/yeast.component';
import { fermentablesComponent } from './components/fermentables/fermentables.component';
import { hopsComponent } from './components/hops/hops.component';
import { adjunctsComponent } from './components/adjuncts/adjuncts.component';
import { yeastsComponent } from './components/yeasts/yeasts.component';
import { flipCardComponent } from './components/flip-card/flip-card.component';
import { newBrewSettingsFormComponent } from './components/new-brew-form-settings/new-brew-form-settings.component';
import { newBrewFermentablesFormComponent } from './components/new-brew-form-fermentables/new-brew-form-fermentables.component';
import { newBrewHopsFormComponent } from './components/new-brew-form-hops/new-brew-form-hops.component';
import { newBrewAdjunctsFormComponent } from './components/new-brew-form-adjuncts/new-brew-form-adjuncts.component';
import { newBrewYeastsFormComponent } from './components/new-brew-form-yeasts/new-brew-form-yeasts.component';
import { newBrewMashFormComponent } from './components/new-brew-form-mash/new-brew-form-mash.component';
import { newBrewBoilFormComponent } from './components/new-brew-form-boil/new-brew-form-boil.component';
import { newBrewFermentationFormComponent } from './components/new-brew-form-fermentation/new-brew-form-fermentation.component';
import { newBrewPackagingFormComponent } from './components/new-brew-form-packaging/new-brew-form-packaging.component';

// services
import { UserService } from '../user.service';
import { BrewCalcService } from './services/brewCalc.service';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: scaphold,
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

const routes: Routes = [
  { path: '', component: newBrewComponent, pathMatch: 'full' },
  { path: ':id', component: viewBrewComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    viewBrewComponent,
    newBrewComponent,
    flipCardComponent,
    fermentableComponent,
    hopComponent,
    adjunctComponent,
    yeastComponent,
    fermentablesComponent,
    hopsComponent,
    adjunctsComponent,
    yeastsComponent,
    newBrewSettingsFormComponent,
    newBrewFermentablesFormComponent,
    newBrewHopsFormComponent,
    newBrewAdjunctsFormComponent,
    newBrewYeastsFormComponent,
    adjunctsComponent,
    newBrewMashFormComponent,
    newBrewBoilFormComponent,
    newBrewFermentationFormComponent,
    newBrewPackagingFormComponent,
    parseMash,
    round,
    FocusDirective,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ApolloModule.forRoot(provideClient),
    loaderModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    UserService,
    BrewCalcService,
  ]
})
export class brewModule { }