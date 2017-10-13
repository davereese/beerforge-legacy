import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// containers
import { AppComponent } from './app.component';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';

// components

// services
import { UserService } from './services/user.service';
import { UserBrewsService } from './services/userBrews.service';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
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
    FormsModule,
    UserDashboardModule,
    BrowserAnimationsModule
  ],
  providers: [
    UserService,
    UserBrewsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
