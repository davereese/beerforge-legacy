import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserTagsService } from 'app/services/userTags.service';
import { StyleTagsService } from 'app/services/styleTags.service';
import { gqlTag } from 'app/brew/models/brew.interface';
import { searchListItem } from 'app/shared/search-list/search-list.model';

@Component({
  selector: 'new-tags-form',
  styleUrls: ['new-brew-form-tags.component.scss'],
  templateUrl: './new-brew-form-tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class newBrewTagsFormComponent implements OnInit, OnDestroy {
  userTagsSubscription: Subscription;
  userTags: Array<gqlTag>;
  styleTagsSubscription: Subscription;
  styleTags: Array<gqlTag>;
  filteredTags: Object;
  displayTags: boolean = false;
  tagValue: string = '';

  @Input() parent: FormGroup;
  @Output() enable: EventEmitter<any> = new EventEmitter<any>();
  @Output() disable: EventEmitter<any> = new EventEmitter<any>();
  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private userTagsService: UserTagsService,
    private styleTagsService: StyleTagsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // If a previously saved tag is selected to be added, make sure to add its id to the form as well
    this.userTagsService.reloadTags();
    this.userTagsSubscription = this.userTagsService.userTags$.subscribe(userTags => {
      if (userTags) {
        this.userTags = userTags.map(item => {
          const newItem: searchListItem = {
            name: item.node.tagName,
            value: item.node.id
          }
          return newItem;
        });
        this.changeDetectorRef.detectChanges();
      }
    });

    this.styleTagsService.reloadTags();
    this.styleTagsSubscription = this.styleTagsService.styleTags$.subscribe(styleTags => {
      if (styleTags) {
        this.styleTags = styleTags.map(item => {
          const newItem: searchListItem = {
            name: item.node.tagName,
            value: item.node.id
          }
          return newItem;
        });
        this.changeDetectorRef.detectChanges();
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

  enableAdd(value) {
    this.parent.get('brewFormTags').setValue({
      tag: value,
      tagId: '',
      new: true
    });
  }

  handleAdd(tag) {
    this.add.emit(tag);
  }

  patchTags() {
    this.parent.get('brewFormTags').patchValue({
      tag: '',
      tagId: '',
      new: true
    });
  }

  ngOnDestroy() {
    if (this.userTagsSubscription) {
      this.userTagsSubscription.unsubscribe();
    }

    if (this.styleTagsSubscription) {
      this.styleTagsSubscription.unsubscribe();
    }
  }
}
