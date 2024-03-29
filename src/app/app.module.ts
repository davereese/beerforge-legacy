import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

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
import { LogInService } from './services/login.service';
import { SignUpService } from './services/signup.service';
import { ProfilePicService } from './services/profilePic.service';
import { UserTagsService } from './services/userTags.service';
import { StyleTagsService } from './services/styleTags.service';
import { BadgeService } from 'app/services/badge.service';
import { UserBadgesService } from 'app/services/userBadges.service';

const networkInterface = createNetworkInterface({ uri: scaphold });
const networkInterfaceAuth = createNetworkInterface({ uri: scaphold });

networkInterfaceAuth.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    req.options.headers.authorization = 'Bearer ' + localStorage.getItem('beerforge_JWT') || null;
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface: networkInterface
});
const authClient = new ApolloClient({
  networkInterface: networkInterfaceAuth
});

export function provideClients() {
  return {
    default: client,
    auth: authClient
  };
}

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full', data: { page: 'login' } },
  { path: 'brew', loadChildren: 'app/brew/brew.module#brewModule', data: { page: 'brew' } },
  // { path: '**', component: NotFound }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ApolloModule.forRoot(provideClients),
    FormsModule,
    LoginModule,
    UserDashboardModule,
    BrowserAnimationsModule
  ],
  providers: [
    LogInService,
    UserService,
    UserBadgesService,
    UserBrewsService,
    BadgeService,
    UserTagsService,
    StyleTagsService,
    SignUpService,
    ProfilePicService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
