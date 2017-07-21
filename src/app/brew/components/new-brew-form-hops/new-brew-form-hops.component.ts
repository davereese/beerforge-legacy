import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { getHopsQuery } from '../../models/getIngredients.model';

@Component({
  selector: 'new-hops-form',
  styleUrls: ['new-brew-form-hops.component.scss'],
  templateUrl: './new-brew-form-hops.component.html'
})
export class newBrewHopsFormComponent implements OnInit, OnChanges {
  hops: any = [];
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
        if ( 0 < value.hop.length && 0 < value.hopAlphaAcid && 0 < value.hopTime && 0 < value.hopWeight ) {
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
    this.selectedHopId = this.data !== null ? this.data.hop.id : 0;
    this.selectedHopAlpha = this.data !== null ? this.data.alpha : null;
    this.selectedHopTime = this.data !== null ? this.data.time : null;
    this.selectedHopWeight = this.data !== null ? this.data.weight : null;
  }
}
