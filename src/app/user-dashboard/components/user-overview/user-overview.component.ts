import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { User } from '../../models/user.interface';
import { Brew } from 'app/brew/models/brew.interface';

@Component({
  selector: 'user-overview',
  styleUrls: ['user-overview.component.scss'],
  templateUrl: './user-overview.component.html'
})
export class UserOverviewComponent implements OnInit {
  profilePicUrl: string;

  @Input()
  user: User;

  @Input()
  userBrews: any[];

  @Output()
  editProfile: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.profilePicUrl = this.user.profilePic.blobUrl ? this.user.profilePic.blobUrl : this.user.profilePic.defaultPicNumber ? '../assets/images/plaid_' + this.user.profilePic.defaultPicNumber + '.svg' : null
  }

  handleClick(event) {
    this.editProfile.emit(event);
  }
}
