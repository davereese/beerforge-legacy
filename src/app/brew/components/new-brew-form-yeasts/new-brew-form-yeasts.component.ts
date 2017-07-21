import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { Yeast } from '../../models/brew.interface';
import { getYeastsQuery } from '../../models/getIngredients.model';

@Component({
  selector: 'new-yeasts-form',
  styleUrls: ['new-brew-form-yeasts.component.scss'],
  templateUrl: './new-brew-form-yeasts.component.html'
})
export class newBrewYeastsFormComponent implements OnInit, OnChanges {
  yeasts: Yeast;
  selectedYeastId: string;
  selectedYeastPackage: string;
  selectedYeastAmount: number;

  // packageType Enum
  packageTypes: any[] = [
    { name: 'Pack', value: 'pack' },
    { name: 'Vial', value: 'vial' },
    { name: 'Starter', value: 'starter' },
  ];

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
      query: getYeastsQuery
    }).subscribe(({data, loading}) => {
      this.yeasts = data['viewer']['allYeasts']['edges'];
    });

    this.parent.get('brewFormYeasts')
      .valueChanges.subscribe(value => {
        if ( 0 < value.yeast.length && 0 < value.yeastPackage.length && 0 < value.yeastAmount ) {
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
    this.selectedYeastId = this.data !== null ? this.data.yeast.id : 0;
    this.selectedYeastPackage = this.data !== null ? this.data.package : 0;
    this.selectedYeastAmount = this.data !== null ? this.data.amount : null;
  }
}
