import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { scaphold } from '../../../scaphold/scaphold';

// containers
import { viewBrewComponent } from './containers/view-brew/view-brew.component';

// components

// services
import { UserService } from '../user.service';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: scaphold,
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

const routes: Routes = [
  { path: '', component: viewBrewComponent }
];

@NgModule({
  declarations: [
    viewBrewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ApolloModule.forRoot(provideClient),
  ],
  providers: [
    UserService
  ]
})
export class brewModule { }