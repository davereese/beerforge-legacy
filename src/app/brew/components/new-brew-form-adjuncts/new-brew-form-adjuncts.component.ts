import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';

// import { Malt } from '../../models-shared/brew.interface';
// import { getMaltsQuery } from '../../models-shared/getIngredients.model';

@Component({
  selector: 'new-adjuncts-form',
  styleUrls: ['new-brew-form-adjuncts.component.scss'],
  templateUrl: './new-brew-form-adjuncts.component.html'
})
export class newBrewAdjunctsFormComponent {
  // adjuncts: Malt;

  @Input()
  parent: FormGroup;

  @Input()
  data: any;

  constructor(
    private apollo: Apollo
  ) { }

  // ngOnInit() {
  //   this.apollo.watchQuery({
  //     query: getAdjunctsQuery
  //   }).subscribe(({data, loading}) => {
  //     this.malts = data['viewer']['allMalts']['edges'];
  //   });
  // }
}
