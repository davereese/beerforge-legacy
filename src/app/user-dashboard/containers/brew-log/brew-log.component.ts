import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Brew } from 'app/brew/models/brew.interface';

import { UserService } from '../../../services/user.service';
import { UserBrewsService } from '../../../services/userBrews.service';
import { BrewCalcService } from '../../../services/brewCalc.service';


@Component({
  selector: 'brew-log',
  styleUrls: ['brew-log.component.scss'],
  templateUrl: './brew-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrewLogComponent implements OnInit, OnDestroy {
  userBrews: Array<Brew>;
  brewsSubscription: Subscription;
  pageInfo: any[];

  // Pagination arguments.
  results: number = 20;
  page: number = 1;

  constructor(
    private userService: UserService,
    private userBrewsService: UserBrewsService,
    private brewCalcService: BrewCalcService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userBrewsService.loadInitialData();
    this.brewsSubscription = this.userBrewsService.brews$.subscribe(brews => {
      this.userBrews = brews['brews'];
      this.pageInfo = brews['pageInfo'];
      this.changeDetectorRef.detectChanges();
    });
  }

  handlePrevPage(item) {
    this.userBrewsService.loadInitialData(null, null, this.results, item);
    this.page -= 1;
  }

  handleFirstPage() {
    this.userBrewsService.loadInitialData(this.results);
    this.page = 1;
  }

  handleNextPage(item) {
    this.userBrewsService.loadInitialData(this.results, item, null, null);
    this.page += 1;
  }

  newBrew() {
    this.router.navigate(['/brew']);
  }

  viewBrew(id) {
    this.router.navigate(['/brew/', id]);
  }

  ngOnDestroy() {
    this.brewsSubscription.unsubscribe();
  }
}
