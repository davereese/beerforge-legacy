import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'new-settings-form',
  styleUrls: ['new-brew-form-settings.component.scss'],
  templateUrl: './new-brew-form-settings.component.html'
})
export class newBrewSettingsFormComponent {
  batchType: string;

  @Input()
  parent: FormGroup;

  // BatchType Enum
  batchTypes: any[] = [
    { name: 'All Grain', value: 'allGrain' },
    { name: 'Partial Mash', value: 'partial' },
    { name: 'Extract', value: 'extract' },
  ];

  ngOnInit() {
    this.batchType = null !== this.parent.get('brewFormSettings.batchType').value ? this.parent.get('brewFormSettings.batchType').value : '';
  }
}
