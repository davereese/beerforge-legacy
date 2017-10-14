import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'new-mash-form',
  styleUrls: ['new-brew-form-mash.component.scss'],
  templateUrl: './new-brew-form-mash.component.html'
})
export class newBrewMashFormComponent {
  @Input()
  parent: FormGroup;
}
