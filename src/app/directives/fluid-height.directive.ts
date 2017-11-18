import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[fluid-height]'
})
export class FluidHeightDirective implements OnInit {
  constructor(
    public elementRef: ElementRef) {}

  ngOnInit() {
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.style.height = "auto";
      this.elementRef.nativeElement.style.height = (this.elementRef.nativeElement.scrollHeight + 25)+"px";
    }
  }
}