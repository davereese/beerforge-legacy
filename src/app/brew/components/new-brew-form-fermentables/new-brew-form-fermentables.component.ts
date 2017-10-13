import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { Malt } from '../../models/brew.interface';
import { getMaltsQuery } from '../../models/getIngredients.model';

@Component({
  selector: 'new-fermentables-form',
  styleUrls: ['new-brew-form-fermentables.component.scss'],
  templateUrl: './new-brew-form-fermentables.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class newBrewFermentablesFormComponent implements OnInit, OnChanges {
  malts: any;
  selectedFermentable: Malt;
  selectedFermentableId: string;
  selectedFermentableWeight: number;

  @Input()
  parent: FormGroup;

  @Input()
  data: any;

  @Output()
  enable: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  disable: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private apollo: Apollo,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.setvalues();

    this.apollo.watchQuery({
      query: getMaltsQuery
    }).subscribe(({data, loading}) => {
      this.malts = data['viewer']['allMalts']['edges'];
      this.changeDetectorRef.detectChanges();
    });

    this.parent.get('brewFormFermentables')
      .valueChanges.subscribe(value => {
        // all fields need to be filled out in order to add fermentable
        if ( 0 < value.fermentableId.length && 0 < value.fermentableWeight ) {
          this.enable.emit();
        } else {
          this.disable.emit();
        }

        // Watch for what malt gets selected and update the fermentable from the object
        // with the corresponding ID. Only run after this.malts has been defined and
        // value.fermentableId has been selected (is not 0).
        if ( undefined !== this.malts && 0 !== value.fermentableId) {
          let malt = this.malts.filter(function( obj ) {
            return obj.node.id === value.fermentableId;
          });
          this.selectedFermentable = malt[0].node;
        }
      });
  }

  ngOnChanges() {
    this.setvalues();
  }

  setvalues() {
    // if data is set then we are editing a fermentable
    this.selectedFermentableId = this.data !== null ? this.data.fermentable.id : 0;
    this.selectedFermentableWeight = this.data !== null ? this.data.weight : null;
  }
}
