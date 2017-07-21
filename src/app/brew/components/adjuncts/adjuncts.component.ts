import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'adjuncts',
  styleUrls: ['adjuncts.component.scss'],
  templateUrl: './adjuncts.component.html'
})
export class adjunctsComponent {
  @Input()
  parent: FormGroup;

  get adjuncts() {
    return (this.parent.get('adjuncts') as FormArray).controls;
  }
}
