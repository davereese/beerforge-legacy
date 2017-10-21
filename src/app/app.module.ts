import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApolloModule } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { scaphold } from '../../scaphold/scaphold';

// containers
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';

// components

// services
import { UserService } from './services/user.service';
import { UserBrewsService } from './services/userBrews.service';
import { LogInService } from 'app/services/login.service';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: scaphold,
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'brew', loadChildren: 'app/brew/brew.module#brewModule' },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    ApolloModule.forRoot(provideClient),
    FormsModule,
    LoginModule,
    UserDashboardModule,
    BrowserAnimationsModule
  ],
  providers: [
    LogInService,
    UserService,
    UserBrewsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
