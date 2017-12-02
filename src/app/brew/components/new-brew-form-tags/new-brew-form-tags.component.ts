import { Component,
         Input,
         Output,
         EventEmitter,
         ChangeDetectorRef,
         OnInit,
         OnDestroy,
         ChangeDetectionStrategy,
         ViewChildren,
         QueryList,
         ElementRef,
         ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserTagsService } from 'app/services/userTags.service';
import { gqlTag } from 'app/brew/models/brew.interface';

@Component({
  selector: 'new-tags-form',
  styleUrls: ['new-brew-form-tags.component.scss'],
  templateUrl: './new-brew-form-tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class newBrewTagsFormComponent implements OnInit, OnDestroy {
  userTagsSubscription: Subscription;
  userTags: Array<gqlTag>;
  filteredTags: Object;
  displayTags: boolean = false;
  tagValue: string = '';

  @Input() parent: FormGroup;
  @Output() enable: EventEmitter<any> = new EventEmitter<any>();
  @Output() disable: EventEmitter<any> = new EventEmitter<any>();
  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('tagsList') tagsListItems: QueryList<any>;
  @ViewChild('customTag') tagInput: ElementRef;

  constructor(
    private userTagsService: UserTagsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // If a previously saved tag is selected to be added, make sure to add its id to the form as well
    this.userTagsService.reloadTags();
    this.userTagsSubscription = this.userTagsService.userTags$.subscribe(userTags => {
      if (userTags) {
        this.userTags = userTags;
        this.assignCopy();
      }
    });

    this.parent.get('brewFormTags')
      .valueChanges.subscribe(value => {
        if ( 0 < value.tag.length ) {
          this.enable.emit();
        } else {
          this.disable.emit();
        }
      });
  }

  handleRemove(tag) {
    this.remove.emit(tag);
  }

  assignCopy() {
    this.filteredTags = Object.assign([], this.userTags);
  }

  filterTagList(value) {
    this.displayTags = true;
    if (!value) {
      this.assignCopy(); //when nothing has been typed
    }
    this.parent.get('brewFormTags').patchValue({
      tagId: '',
      new: true
    });
    this.filteredTags = Object.assign([], this.userTags).filter(
       item => JSON.stringify(item.node.tagName).toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }

  addTag(value, event) {
    if ( 'click' === event.type ) {
      this.parent.get('brewFormTags').setValue({
        tag: value.node.tagName,
        tagId: value.node.id,
        new: false
      });
      this.tagInput.nativeElement.focus();
      this.displayTags = false;
      this.changeDetectorRef.detectChanges();
    } else {
      this.displayTags = false;
      this.add.emit(value);
    }

    if ( true === event.add ) {
      this.add.emit(value);
    }
    this.changeDetectorRef.detectChanges();
  }

  moveSelection(index, direction) {
    const list = this.tagsListItems.toArray();
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
    this.displayTags = true;
  }

  checkKey(event, value = null, index = null) {
    if ( 'keyup' === event.type ) {
      if ( 13 === event.keyCode ) { // enter
        if ( null === index ) {
          // coming from input
          this.addTag(value, event);
        } else {
          // coming from list, so simulate a click to add value to input
          this.addTag(value, {type: 'click', add: true});
        }
      } else if ( 40 === event.keyCode || 38 === event.keyCode ) { // up/down arrow
        this.moveSelection(index, event.keyCode);
      }
    } else {
      if (event.relatedTarget) {
        if ('tagsList__item' !== event.relatedTarget.attributes.class.nodeValue) {
          this.displayTags = false;
        }
      } else {
        this.displayTags = false;
      }
    }
  }

  preventScroll(event) {
    if ( 40 === event.keyCode || 38 === event.keyCode ) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    if (this.userTagsSubscription) {
      this.userTagsSubscription.unsubscribe();
    }
  }
}
