import { Component, Input, Output, EventEmitter, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'modal',
  styleUrls: ['./modal.component.scss'],
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @Input()
  data;

  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router
  ) {}

  viewBrew(data) {
    this.router.navigate(['/brew/', data]);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  closeModal() {
    this.close.emit();
  }
}
