import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { modalPop } from '../../../animations/modal-pop';
import { modalData } from '../../../modal/models/modal.model';

import { User } from '../../models/user.interface';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'user-profile',
  styleUrls: ['user-profile.component.scss'],
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    modalPop
  ]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: User;
  userSubscription: Subscription;
  profilePicUrl: string = '';
  newProfilePic: boolean = false;
  picValue: string;
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  city: string = '';
  state: string = '';
  editingName: boolean = false;
  errorMessage: string = '';
  modalData: modalData;
  showModal: boolean = false;
  @ViewChild('profilePicInput') profilePicInput:ElementRef;

  constructor(
    private router: Router,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.username = this.currentUser.username;
        this.firstName = this.currentUser.firstName;
        this.lastName = this.currentUser.lastName;
        this.email = this.currentUser.email;
        this.city = this.currentUser.city;
        this.state = this.currentUser.state;

        this.profilePicUrl = this.currentUser.profilePic.blobUrl ? this.currentUser.profilePic.blobUrl : this.currentUser.profilePic.defaultPicNumber ? '../assets/images/plaid_' + this.currentUser.profilePic.defaultPicNumber + '.svg' : null;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  readImageAsUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.errorMessage = '';

      if (750000 >= event.target.files[0].size) {
        this.newProfilePic = true;

        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.profilePicUrl = event.target.result;
          this.changeDetectorRef.detectChanges();
        }
        reader.readAsDataURL(event.target.files[0]);
        
        this.changeDetectorRef.detectChanges();
      } else {
        this.profilePicInput.nativeElement.value = null;
        this.errorMessage = 'Hoo-boy, that image is too large. Please use an image smaller than 750kb.';
      }
    }
  }

  nameFocus(e) {
    this.editingName = true;
  }

  nameBlur(e, keyup = false) {
    if ( true === keyup ) {
      if ( 13 === e.keyCode ) {
        this.username = e.target.value;
        this.editingName = false;
      }
    } else {
      this.username = e.target.value;
      this.editingName = false;
    }

    if ( '' === e.target.value ) {
      this.username = this.currentUser.username;
    }
  }

  closeModal() {
    this.showModal = false;
  }

  handleCancel(event: any) {
    this.router.navigate(['/dashboard']);
  }

  handleSave(event: any) {
    const profilePic = this.newProfilePic ? this.profilePicInput : null;
    this.userService.updateUser(this.username, this.firstName, this.lastName, this.email, this.city, this.state, profilePic, data => {
      if ('success' !== data.user || false === data.profilePic) {
        this.modalData = {
          title: 'Well, Shoot',
          body: 'There was an error updating your profile. Please try again later.',
          buttons: { close: true, dashboard: true }
        }
        this.showModal = true;
      }
    });
  }

  ngOnDestroy() {
    if (undefined !== this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
