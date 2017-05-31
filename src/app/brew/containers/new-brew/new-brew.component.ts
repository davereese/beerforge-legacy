import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Brew } from '../../models-shared/brew.interface';
import { UserService } from '../../../user.service';
import { BrewService } from '../../brew.service';

@Component({
  selector: 'new-brew',
  styleUrls: ['new-brew.component.scss'],
  templateUrl: './new-brew.component.html',
})
export class newBrewComponent {
}
