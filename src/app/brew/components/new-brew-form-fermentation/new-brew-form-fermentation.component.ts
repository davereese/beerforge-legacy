import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'new-fermentation-form',
  styleUrls: ['new-brew-form-fermentation.component.scss'],
  templateUrl: './new-brew-form-fermentation.component.html'
})
export class newBrewFermentationFormComponent implements OnInit {
  @Input()
  parent: FormGroup;

  secondary: boolean;

  constructor() { }

  ngOnInit() {
    this.secondary = this.parent.value.brewFormFermentation.fermentSecCheck;
  }

  toggleSec() {
    if ( true === this.secondary ) {
      this.parent.get('brewFormFermentation').patchValue({
        fermentSecTime: '',
        fermentSecTemp: '',
        fermentSecCheck: false,
      });
    }
    this.secondary = !this.secondary;
  }
}
