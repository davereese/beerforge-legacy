import { Component, Input } from '@angular/core';

@Component({
  selector: 'loader',
  styleUrls: ['loader.component.scss'],
  templateUrl: './loader.component.html'
})
export class loaderComponent {
  @Input()
  state: boolean;
}
