import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Tag } from '../../models/brew.interface';

@Component({
  selector: 'tag',
  styleUrls: ['tag.component.scss'],
  templateUrl: './tag.component.html'
})
export class tagComponent {
  @Input() tag: Tag;
  @Input() editable: boolean = false;
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  removeTag(event) {
    this.remove.emit(event);
  }
}
