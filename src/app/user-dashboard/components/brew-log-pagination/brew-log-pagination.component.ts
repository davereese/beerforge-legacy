import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'brew-log-pagination',
  styleUrls: ['brew-log-pagination.component.scss'],
  templateUrl: './brew-log-pagination.component.html',
})
export class BrewLogPaginationComponent {
  currentPage: number;

  @Input()
  brews: any[];

  @Input()
  pageInfo: any[];

  @Input()
  pages: number;

  @Input()
  page: number;

  @Input()
  results: number;

  @Output()
  getPageEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  nextPageEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  prevPageEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  firstPageEvent: EventEmitter<any> = new EventEmitter<any>();

  ngOnChanges() {
    this.currentPage = this.page;
  }

  getNumber = function(num) {
    return new Array(num);
  }

  getPage(index) {
    this.getPageEvent.emit(index);
  }

  prevPage(item) {
    if (2 === this.currentPage) {
      this.firstPageEvent.emit();
    } else {
      this.prevPageEvent.emit(item);  
    }
  }

  nextPage(item) {
    this.nextPageEvent.emit(item);
  }
}