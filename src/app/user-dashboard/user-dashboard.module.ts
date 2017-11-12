import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApolloModule } from 'apollo-angular';
import { scaphold } from '../../../scaphold/scaphold';

import { loaderModule } from '../loader/loader.module';
import { PipeModule } from '../pipes.module';
import { sharedDirectivesModule } from '../directives/shared-directives.module';
import { modalModule } from '../modal/modal.module';

// containers
import { UserDashboardComponent } from './containers/user-dashboard/user-dashboard.component';
import { BrewLogComponent } from './containers/brew-log/brew-log.component';
import { UserProfileComponent } from './containers/user-profile/user-profile.component';

// components
import { UserOverviewComponent } from './components/user-overview/user-overview.component';
import { BrewLogOverviewComponent } from './components/brew-log-overview/brew-log-overview.component';
import { BrewLogPaginationComponent } from './components/brew-log-pagination/brew-log-pagination.component';

// services
import { UserService } from '../services/user.service';
import { BrewCalcService } from '../services/brewCalc.service';

const routes: Routes = [
  { path: 'dashboard', component: UserDashboardComponent, pathMatch: 'full', data: { page: 'dash' } },
  { path: 'brew-log', component: BrewLogComponent, pathMatch: 'full', data: { page: 'log' } },
  { path: 'profile/:id', component: UserProfileComponent, pathMatch: 'full', data: { page: 'profile' } },
];

@NgModule({
  declarations: [
    UserDashboardComponent,
    BrewLogComponent,
    UserOverviewComponent,
    BrewLogOverviewComponent,
    BrewLogPaginationComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ApolloModule,
    loaderModule,
    PipeModule,
    FormsModule,
    sharedDirectivesModule,
    modalModule
  ],
  providers: [
    UserService,
    BrewCalcService
  ]
})
export class UserDashboardModule { }
