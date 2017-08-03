import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Malt } from '../../models/brew.interface';

@Component({
  selector: 'fermentables',
  styleUrls: ['fermentables.component.scss'],
  templateUrl: './fermentables.component.html'
})
export class fermentablesComponent implements OnInit {
  // maltsMap: Map<string, Malt>;
  fermentables: any;

  @Input()
  parent: FormGroup;

  @Output()
  selectedFermentables: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  edit: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.fermentables = (this.parent.get('fermentables') as FormArray).controls;
  }

  handleEdit(event, fermentable, weight, index) {
    // combine into object
    let editing = {
      fermentable: fermentable,
      weight: weight,
      index: index
    }
    this.edit.emit(editing);
  }
}
