import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { scaphold } from '../../../scaphold/scaphold';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: scaphold,
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

// containers
import { UserDashboardComponent } from './containers/user-dashboard/user-dashboard.component';

// components
import { UserOverviewComponent } from './components/user-overview/user-overview.component';
import { BrewLogOverviewComponent } from './components/brew-log-overview/brew-log-overview.component';

// services


const routes: Routes = [
  { path: 'dashboard', component: UserDashboardComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [
    UserDashboardComponent,
    UserOverviewComponent,
    BrewLogOverviewComponent
  ],
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule.forChild(routes),
    ApolloModule.forRoot(provideClient),
  ],
  providers: []
})
export class UserDashboardModule { }
