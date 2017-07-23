import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'new-packaging-form',
  styleUrls: ['new-brew-form-packaging.component.scss'],
  templateUrl: './new-brew-form-packaging.component.html'
})
export class newBrewPackagingFormComponent {
  @Input()
  parent: FormGroup;

  // Packaging Enum
  packagingTypes: any[] = [
    { name: 'Kegged', value: 'kegged' },
    { name: 'Bottled', value: 'bottled' }
  ];

  // Carbonation Enum
  carbonationTypes: any[] = [
    { name: 'Forced', value: 'forced' },
    { name: 'Corn Sugar', value: 'cornSugar' },
    { name: 'Cane Sugar', value: 'caneSugar' },
    { name: 'DME', value: 'dme' }
  ];
}
