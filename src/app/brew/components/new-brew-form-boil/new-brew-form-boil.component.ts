import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'new-boil-form',
  styleUrls: ['new-brew-form-boil.component.scss'],
  templateUrl: './new-brew-form-boil.component.html'
})
export class newBrewBoilFormComponent {
  @Input()
  parent: FormGroup;
}
