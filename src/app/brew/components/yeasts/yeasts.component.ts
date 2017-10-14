import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Yeast } from '../../models/brew.interface';

@Component({
  selector: 'yeasts',
  styleUrls: ['yeasts.component.scss'],
  templateUrl: './yeasts.component.html'
})
export class yeastsComponent implements OnInit {
  yeasts: any;

  @Input()
  parent: FormGroup;

  @Output()
  selectedYeasts: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  edit: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.yeasts = (this.parent.get('yeasts') as FormArray).controls;
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
