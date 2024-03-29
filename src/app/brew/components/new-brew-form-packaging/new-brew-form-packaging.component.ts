import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'new-packaging-form',
  styleUrls: ['new-brew-form-packaging.component.scss'],
  templateUrl: './new-brew-form-packaging.component.html'
})
export class newBrewPackagingFormComponent implements OnInit {
  packageType: string;
  carbonationMethod: string;

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

  constructor() { }

  ngOnInit() {
    this.parent.get('brewFormPackaging')
      .valueChanges.subscribe(value => {
        if ( 'bottled' === this.parent.get('brewFormPackaging.packageType').value ) {
          this.carbonationTypes = [
            { name: 'Corn Sugar', value: 'cornSugar' },
            { name: 'Cane Sugar', value: 'caneSugar' },
            { name: 'DME', value: 'dme' }
          ];
        } else {
          this.carbonationTypes = [
            { name: 'Forced', value: 'forced' },
            { name: 'Corn Sugar', value: 'cornSugar' },
            { name: 'Cane Sugar', value: 'caneSugar' },
            { name: 'DME', value: 'dme' }
          ];
        }

        if ( 'bottled' === this.parent.get('brewFormPackaging.packageType').value && 'forced' === this.parent.get('brewFormPackaging.carbonationMethod' ).value) {
          this.parent.get('brewFormPackaging').patchValue({
            carbonationMethod: ''
          });
        }
      })

    this.setvalues();
  }

  setvalues() {
    this.packageType = null !== this.parent.get('brewFormPackaging.packageType').value ? this.parent.get('brewFormPackaging.packageType').value : '';
    this.carbonationMethod = null !== this.parent.get('brewFormPackaging.carbonationMethod').value ? this.parent.get('brewFormPackaging.carbonationMethod').value : '';
  }
}
