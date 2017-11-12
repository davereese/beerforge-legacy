import { NgModule } from '@angular/core';

// Directives
import { FocusDirective } from './focus.directive';

@NgModule({
  declarations: [
    FocusDirective
  ],
  exports: [
    FocusDirective
  ]
})
export class sharedDirectivesModule { }
