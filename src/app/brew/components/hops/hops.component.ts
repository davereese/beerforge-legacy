import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Hop } from '../../models/brew.interface';

@Component({
  selector: 'hops',
  styleUrls: ['hops.component.scss'],
  templateUrl: './hops.component.html'
})
export class hopsComponent implements OnInit {
  hops: any;

  @Input()
  parent: FormGroup;

  @Input()
  gravities: any;

  @Output()
  selectedHops: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  edit: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.hops = (this.parent.get('hops') as FormArray).controls;
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
