import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { Yeast } from '../../models/brew.interface';
import { getYeastsQuery } from '../../models/getIngredients.model';

@Component({
  selector: 'yeasts',
  styleUrls: ['yeasts.component.scss'],
  templateUrl: './yeasts.component.html'
})
export class yeastsComponent {
  yeastsMap: Map<string, Yeast>;

  @Input()
  parent: FormGroup;

  @Output()
  selectedYeasts: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  edit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: getYeastsQuery
    }).subscribe(({data, loading}) => {
      let allYeasts = data['viewer']['allYeasts']['edges'];
      const theMap = allYeasts.map( yeast => [yeast.node.id, yeast.node]);

      this.yeastsMap = new Map<string, Yeast>(theMap);
    });

    // watch for changes to selected yeasts
    this.parent.get('yeasts')
      .valueChanges.subscribe(value => {
        let selected = this.combineYeasts(value);
        this.selectedYeasts.emit(selected);
      });
  }

  combineYeasts(value) {
    let selected = [],
        yeastBlend;
    for (let i = 0; i < value.length; i++) {
      let yeastValues = this.getYeast(value[i].yeast);
      yeastBlend = Object.assign(value[i], yeastValues);
      selected.push(yeastBlend);
    }
    return selected;
  }

  getYeast(id) {
    return this.yeastsMap.get(id);
  }

  get yeasts() {
    return (this.parent.get('yeasts') as FormArray).controls;
  }

  handleEdit(event, yeast, packageType, amount, index) {
    // combine into object
    let editing = {
      yeast: yeast,
      package: packageType,
      amount: amount,
      index: index
    }
    this.edit.emit(editing);
  }
}
