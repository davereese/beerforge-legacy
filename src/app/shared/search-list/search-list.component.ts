import { Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterContentInit,
  ViewChildren,
  ViewChild,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { gqlTag } from 'app/brew/models/brew.interface';
import { searchListItem } from './search-list.model';

@Component({
  selector: 'search-list',
  styleUrls: ['search-list.component.scss'],
  templateUrl: './search-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class searchListComponent implements OnInit, AfterContentInit {
  displayItems: boolean = false;
  filteredItems: Object;
  inputValue: string = '';
  componentWidth: number;

  @Input() parent: FormGroup;
  @Input() placeholder: string;
  @Input() label: string;
  @Input() items: Array<searchListItem>;
  @Input() allowCustom: boolean = true;

  @Output() patch: EventEmitter<any> = new EventEmitter<any>();
  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  @Output() hasText: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('itemList') listItems: QueryList<any>;
  @ViewChild('itemInput') itemInput: ElementRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.assignCopy();
  }

  ngAfterContentInit() {
    this.componentWidth = this.itemInput.nativeElement.clientWidth;
  }

  assignCopy() {
    this.filteredItems = Object.assign([], this.items);
  }

  filterTagList(value) {
    this.displayItems = true;
    if (!value) {
      this.assignCopy(); //when nothing has been typed
    }
    this.patch.emit();
    this.filteredItems = Object.assign([], this.items).filter(
       item => JSON.stringify(item.name).toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }

  notifyParent(value) {
    this.hasText.emit(value);
  }

  addItem(value, event) {
    if ( 'click' === event.type ) {
      this.parent.get('brewFormTags').setValue({
        tag: value.name,
        tagId: value.value,
        new: true
      });
      this.itemInput.nativeElement.focus();
      this.displayItems = false;
      this.changeDetectorRef.detectChanges();
    } else {
      this.parent.get('brewFormTags').setValue({
        tag: value,
        tagId: '',
        new: true
      });
      this.displayItems = false;
    }

    this.add.emit(value);
    this.inputValue = '';
    this.changeDetectorRef.detectChanges();
  }

  moveSelection(index, direction) {
    const list = this.listItems.toArray();
    if ( 40 === direction ) {
      const i = null !== index ? index+1 : 0;
      if (i < list.length) {
        list[i].nativeElement.focus();
      }
    } else if ( 38 === direction ) {
      const i = null !== index ? index-1 : 0;
      if (i >= 0) {
        list[i].nativeElement.focus();
      }
    }
    this.displayItems = true;
  }

  preventScroll(event) {
    if ( 40 === event.keyCode || 38 === event.keyCode ) {
      event.preventDefault();
    }
  }

  checkKey(event, value = null, index = null) {

    if ( 'keyup' === event.type ) {
      if ( 13 === event.keyCode ) { // enter
        if ( null === index ) {
          // coming from input
          if (this.allowCustom === true) {
            this.addItem(value, event);
          }
        } else {
          // coming from list, so simulate a click to add value to input
          this.addItem(value, {type: 'click'});
        }
      } else if ( 40 === event.keyCode || 38 === event.keyCode ) { // up/down arrow
        this.moveSelection(index, event.keyCode);
      }
    } else {
      if (event.relatedTarget) {
        if ('itemList__item' !== event.relatedTarget.attributes.class.nodeValue) {
          this.displayItems = false;
        }
      } else {
        this.displayItems = false;
      }
    }
  }
}
