import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { Hop } from '../../models/brew.interface';
import { getHopsQuery } from '../../models/getIngredients.model';

@Component({
  selector: 'new-hops-form',
  styleUrls: ['new-brew-form-hops.component.scss'],
  templateUrl: './new-brew-form-hops.component.html'
})
export class newBrewHopsFormComponent implements OnInit, OnChanges {
  hops: any = [];
  selectedHop: Hop;
  selectedHopId: string;
  selectedHopAlpha: number;
  selectedHopTime: number;
  selectedHopWeight: number;

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
      query: getHopsQuery
    }).subscribe(({data, loading}) => {
      this.hops = data['viewer']['allHops']['edges'];
    });

    this.parent.get('brewFormHops')
      .valueChanges.subscribe(value => {
        // all fields need to be filled out in order to add hop
        if ( 0 < value.hopId.length && 0 < value.hopAlphaAcid && 0 < value.hopTime && 0 < value.hopWeight ) {
          this.enable.emit();
        } else {
          this.disable.emit();
        }

        // Watch for what hop gets selected and update the hop from the object
        // with the corresponding ID. Only run after this.hops has been defined and
        // value.hopId has been selected (is not 0).
        if ( undefined !== this.hops && 0 < this.hops.length && 0 !== value.hopId) {
          let hop = this.hops.filter(function( obj ) {
            return obj.node.id === value.hopId;
          });

          this.selectedHop = hop[0].node;
          this.selectedHopAlpha = hop[0].node.alphaAcid;
        }
      });
  }

  ngOnChanges() {
    this.setvalues();
  }

  setvalues() {
    // if data is set then we are editing a hop
    this.selectedHopId = this.data !== null ? this.data.hop.id : 0;
    this.selectedHopAlpha = this.data !== null ? this.data.alpha : null;
    this.selectedHopTime = this.data !== null ? this.data.time : null;
    this.selectedHopWeight = this.data !== null ? this.data.weight : null;
  }
}
