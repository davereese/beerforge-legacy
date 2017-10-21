import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ApolloModule } from 'apollo-angular';

// components
import { LoginComponent } from './components/login.component';

// services
import { LogInService } from '../services/login.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    LogInService
  ],
  bootstrap: [LoginComponent]
})
export class LoginModule { }