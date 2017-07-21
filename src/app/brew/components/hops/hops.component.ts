import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { Hop } from '../../models/brew.interface';
import { getHopsQuery } from '../../models/getIngredients.model';

@Component({
  selector: 'hops',
  styleUrls: ['hops.component.scss'],
  templateUrl: './hops.component.html'
})
export class hopsComponent implements OnInit {
  hopsMap: Map<string, Hop>;

  @Input()
  parent: FormGroup;

  @Input()
  hopIBUs: any;

  @Output()
  selectedHops: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  edit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: getHopsQuery
    }).subscribe(({data, loading}) => {
      let allHops = data['viewer']['allHops']['edges'];
      const theMap = allHops.map( hop => [hop.node.id, hop.node]);

      this.hopsMap = new Map<string, Hop>(theMap);
    });

    // watch for changes to selected hops
    this.parent.get('hops')
      .valueChanges.subscribe(value => {
        let selected = this.combineHops(value);
        this.selectedHops.emit(selected);
      });

    // watch for changes to preBoilgravity
    this.parent.get('brewFormGravities.preBoilGravity')
      .valueChanges.subscribe(value => {
        let selected = this.combineHops(this.parent.get('hops').value);
        this.selectedHops.emit(selected);
      });

    // watch for total volume changes
    this.parent.get('brewFormSettings.batchSize')
      .valueChanges.subscribe(value => {
        let selected = this.combineHops(this.parent.get('hops').value);
        this.selectedHops.emit(selected);
      });

    // watch for boil volume changes
    this.parent.get('brewFormBoil.boilSize')
      .valueChanges.subscribe(value => {
        let selected = this.combineHops(this.parent.get('hops').value);
        this.selectedHops.emit(selected);
      });
  }

  combineHops(value) {
    let selected = [],
        hopBlend;
    for (let i = 0; i < value.length; i++) {
      let hopValues = this.getHop(value[i].hop);
      hopBlend = Object.assign(value[i], hopValues);
      selected.push(hopBlend);
    }
    return selected;
  }

  getHop(id) {
    return this.hopsMap.get(id);
  }

  get hops() {
    return (this.parent.get('hops') as FormArray).controls;
  }

  handleEdit(event, hop, weight, alpha, time, index) {
    // combine into object
    let editing = {
      hop: hop,
      weight: weight,
      alpha: alpha,
      time: time,
      index: index
    }
    this.edit.emit(editing);
  }
}
