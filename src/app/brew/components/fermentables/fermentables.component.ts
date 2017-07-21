import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { Malt } from '../../models/brew.interface';
import { getMaltsQuery } from '../../models/getIngredients.model';

@Component({
  selector: 'fermentables',
  styleUrls: ['fermentables.component.scss'],
  templateUrl: './fermentables.component.html'
})
export class fermentablesComponent implements OnInit {
  maltsMap: Map<string, Malt>;

  @Input()
  parent: FormGroup;

  @Output()
  selectedFermentables: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  edit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: getMaltsQuery
    }).subscribe(({data, loading}) => {
      let allMalts = data['viewer']['allMalts']['edges'];
      const theMap = allMalts.map( malt => [malt.node.id, malt.node]);

      this.maltsMap = new Map<string, Malt>(theMap);
    });

    // watch for changes to selected malts
    this.parent.get('fermentables')
      .valueChanges.subscribe(value => {
        let selected = this.combineMalts(value);
        this.selectedFermentables.emit(selected);
      });
    // watch for total volume changes too
    this.parent.get('brewFormSettings.batchSize')
      .valueChanges.subscribe(value => {
        let selected = this.combineMalts(this.parent.get('fermentables').value);
        this.selectedFermentables.emit(selected);
      });
  }

  combineMalts(value) {
    let selected = [],
        fermentableBlend;
    for (let i = 0; i < value.length; i++) {
      let fermentableValues = this.getFermentable(value[i].fermentable);
      fermentableBlend = Object.assign(value[i], fermentableValues);
      selected.push(fermentableBlend);
    }
    return selected;
  }

  getFermentable(id) {
    return this.maltsMap.get(id);
  }

  get fermentables() {
    return (this.parent.get('fermentables') as FormArray).controls;
  }

  handleEdit(event, malt, weight, index) {
    // combine into object
    let editing = {
      malt: malt,
      weight: weight,
      index: index
    }
    this.edit.emit(editing);
  }
}
