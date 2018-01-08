import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';

// Modules
import { loaderModule } from '../loader/loader.module';
import { modalModule } from '../modal/modal.module';
import { sharedDirectivesModule } from '../directives/shared-directives.module';
import { FluidHeightDirective } from '../directives/fluid-height.directive'

// containers
import { viewBrewComponent } from './containers/view-brew/view-brew.component';
import { newBrewComponent } from './containers/new-brew/new-brew.component';

// components
import { loaderComponent } from './components/loader/loader.component';
import { tagComponent } from './components/tag/tag.component';
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
import { newBrewTagsFormComponent } from './components/new-brew-form-tags/new-brew-form-tags.component';
import { searchListComponent } from '../shared/search-list/search-list.component';

// services
import { UserService } from '../services/user.service';
import { UserBrewsService } from '../services/userBrews.service';
import { BrewFormService } from '../services/brewForm.service';
import { BrewCalcService } from '../services/brewCalc.service';
import { BadgeService } from '../services/badge.service';
import { ViewBrewService } from 'app/brew/containers/view-brew/view-brew.service';

const routes: Routes = [
  { path: '', component: newBrewComponent, pathMatch: 'full', data: { page: 'brew' } },
  { path: ':id', component: viewBrewComponent, pathMatch: 'full', data: { page: 'view' } }
];

@NgModule({
  declarations: [
    viewBrewComponent,
    newBrewComponent,
    loaderComponent,
    flipCardComponent,
    tagComponent,
    fermentableComponent,
    hopComponent,
    adjunctComponent,
    yeastComponent,
    fermentablesComponent,
    hopsComponent,
    adjunctsComponent,
    yeastsComponent,
    newBrewSettingsFormComponent,
    newBrewTagsFormComponent,
    newBrewFermentablesFormComponent,
    newBrewHopsFormComponent,
    newBrewAdjunctsFormComponent,
    newBrewYeastsFormComponent,
    adjunctsComponent,
    newBrewMashFormComponent,
    newBrewBoilFormComponent,
    newBrewFermentationFormComponent,
    newBrewPackagingFormComponent,
    FluidHeightDirective,
    searchListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ApolloModule,
    loaderModule,
    modalModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    sharedDirectivesModule
  ],
  providers: [
    UserService,
    UserBrewsService,
    BrewFormService,
    BrewCalcService,
    BadgeService,
    ViewBrewService
  ]
})
export class brewModule { }
