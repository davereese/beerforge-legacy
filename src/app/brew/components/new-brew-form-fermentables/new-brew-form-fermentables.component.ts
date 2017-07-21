import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { Malt } from '../../models/brew.interface';
import { getMaltsQuery } from '../../models/getIngredients.model';

@Component({
  selector: 'new-fermentables-form',
  styleUrls: ['new-brew-form-fermentables.component.scss'],
  templateUrl: './new-brew-form-fermentables.component.html'
})
export class newBrewFermentablesFormComponent implements OnInit, OnChanges {
  malts: Malt;
  selectedMaltId: string;
  selectedMaltWeight: number;

  @Input()
  parent: FormGroup;

  @Input()
  data: any;

  @Output()
  enable: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  disable: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.setvalues();

    this.apollo.watchQuery({
      query: getMaltsQuery
    }).subscribe(({data, loading}) => {
      this.malts = data['viewer']['allMalts']['edges'];
    });

    this.parent.get('brewFormFermentables')
      .valueChanges.subscribe(value => {
        if ( 0 < value.fermentable.length && 0 < value.fermentableWeight ) {
          this.enable.emit();
        } else {
          this.disable.emit();
        }
      });
  }

  ngOnChanges() {
    this.setvalues();
  }

  setvalues() {
    this.selectedMaltId = this.data !== null ? this.data.malt.id : 0;
    this.selectedMaltWeight = this.data !== null ? this.data.weight : null;
  }
}
