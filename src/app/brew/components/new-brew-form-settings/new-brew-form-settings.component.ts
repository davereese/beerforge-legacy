import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Brew } from '../../models/brew.interface';

@Component({
  selector: 'new-settings-form',
  styleUrls: ['new-brew-form-settings.component.scss'],
  templateUrl: './new-brew-form-settings.component.html'
})
export class newBrewSettingsFormComponent implements OnInit {
  batchType: string;

  @Input()
  parent: FormGroup;
  @Input()
  view: Brew = null;

  @Output()
  deleteEvent: EventEmitter<any> = new EventEmitter<any>();

  // BatchType Enum
  batchTypes: any[] = [
    { name: 'All Grain', value: 'allGrain' },
    { name: 'Partial Mash', value: 'partial' },
    { name: 'Extract', value: 'extract' },
  ];

  constructor() { }

  ngOnInit() {
    this.batchType = null !== this.parent.get('brewFormSettings.batchType').value ? this.parent.get('brewFormSettings.batchType').value : '';
  }

  delete() {
    this.deleteEvent.emit();
  }
}
