import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { scaphold } from '../../../scaphold/scaphold';

import { parseMash, round } from './models-shared/brew-filter.pipe';

// containers
import { viewBrewComponent } from './containers/view-brew/view-brew.component';
import { newBrewComponent } from './containers/new-brew/new-brew.component';

// components
import { fermentablesComponent } from './components/fermentables/fermentables.component';
import { hopsComponent } from './components/hops/hops.component';
import { yeastComponent } from './components/yeast/yeast.component';

// services
import { UserService } from '../user.service';
import { BrewService } from './brew.service';

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
    fermentablesComponent,
    hopsComponent,
    yeastComponent,
    parseMash,
    round
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ApolloModule.forRoot(provideClient)
  ],
  providers: [
    UserService,
    BrewService
  ]
})
export class brewModule { }