import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserDashboardModule } from './user-dashboard/user-dashboard.module';

// import { ApolloClient, createNetworkInterface } from 'apollo-client';
// import { ApolloModule } from 'apollo-angular';
// import { scaphold } from '../../scaphold/scaphold';

import { AppComponent } from './app.component';

// const client = new ApolloClient({
//   networkInterface: createNetworkInterface({
//     uri: scaphold,
//   }),
// });

// export function provideClient(): ApolloClient {
//   return client;
// }

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    //ApolloModule.forRoot(provideClient),
    UserDashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
