import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared.module';

@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    ModalComponent
  ]
})
export class modalModule {
}
