import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Brew } from '../../models/brew.interface';

import { User } from '../../../user-dashboard/models/user.interface';
import { currentUserQuery } from '../../../user-dashboard/models/getUser.model';
import { saveBrewMutation } from '../../models/saveBrew.model';
import { saveMaltMutation } from '../../models/saveBrew.model';
import { saveHopMutation } from '../../models/saveBrew.model';
import { saveYeastMutation } from '../../models/saveBrew.model';

import { modalData } from '../../../modal/models/modal.model';
import { UserService } from '../../../services/user.service';
import { BrewFormService } from '../../../services/brewForm.service';
import { BrewCalcService } from '../../../services/brewCalc.service';

@Component({
  selector: 'new-brew',
  styleUrls: ['new-brew.component.scss'],
  templateUrl: './new-brew.component.html',
  animations: [
    trigger('flipInOut', [
      state('in', style({transform: 'translateX(0) rotateY(0deg) scale(1)'})),
      transition(':enter', [
        style({transform: 'translateX(128%) rotateY(-90deg) scale(1.3)'}),
        animate('0.49s cubic-bezier(0,0,.12,1)')
      ]),
      transition(':leave', [
        animate('0.35s ease-in', style({transform: 'translateX(128%) rotateY(-90deg) scale(1.3)'}))
      ])
    ]),
    trigger('modalPop', [
      state('in', style({transform: 'translate(-50%, -50%)', opacity: '1'})),
      transition(':enter', [
        style({transform: 'translate(-50%, -20%)', opacity: '0'}),
        animate('0.5s cubic-bezier(.54,0,.03,1)')
      ]),
      transition(':leave', [
        style({transform: 'translate(-50%, -50%)'}),
        animate('0.3s cubic-bezier(.54,0,.03,1)', style({transform: 'translate(-50%, -80%)', opacity: '0'}))
      ])
    ])
  ]
})
export class newBrewComponent implements OnInit {
  loader: boolean = false;
  modalData: modalData;
  showModal: boolean = false;
  userId: string;
  currentUser: User;
  brewName: string = 'New Brew';
  editingName: boolean = false;
  editingData: any = {};
  flipCard: boolean = false;
  editingSection: string;
  newBrewForm: BehaviorSubject<FormGroup>; // form inputs

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private brewFormService: BrewFormService,
    private brewCalcService: BrewCalcService,
    private apollo: Apollo,
    private router: Router
  ) {}

  nameFocus(e) {
    this.editingName = true;
  }

  nameBlur(e, keyup = false) {
    if ( true === keyup ) {
      if ( 13 === e.keyCode ) {
        this.brewName = e.target.value;
        this.editingName = false;
      }
    } else {
      this.brewName = e.target.value;
      this.editingName = false;
    }

    if ( '' === e.target.value ) {
      this.brewName = 'New Brew';
    }
  }

  flipTheCard(editing, editingData = null) {
    this.editingSection = editing;
    this.editingData = editingData;
    this.flipCard = true;
  }

  closeTheCard() {
    this.flipCard = false;
  }

  nextCard() {
    let cards = ['settings', 'fermentables', 'hops', 'yeasts', 'mash', 'boil', 'fermentation', 'packaging'];
    let currentIndex = cards.indexOf(this.editingSection);

    this.editingSection = cards[currentIndex+1];
  }

  editingSelection(editingIndex) {
    let editing: string;
    if ( editingIndex.hasOwnProperty('fermentable') ) {
      editing = 'editFermentable';
    } else if ( editingIndex.hasOwnProperty('hop') ) {
      editing = 'editHop';
    } else if ( editingIndex.hasOwnProperty('adjunct') ) {
      // not currently supported
      // editing = 'editAdjunct';
    } else if ( editingIndex.hasOwnProperty('yeast') ) {
      editing = 'editYeast';
    }
    this.flipTheCard(editing, editingIndex)
  }

  addIngredient(ingredient) {
    this.brewFormService.addIngredient(ingredient);
  }

  editIngredient(ingredient) {
    this.brewFormService.editIngredient(ingredient);
  }

  removeIngredient(ingredient) {
    this.brewFormService.removeIngredient(ingredient);
    this.closeTheCard();
  }

  ngOnInit() {
    this.userService
      .getUser()
      .subscribe((data: string) => {
        this.userId = data
      });

    this.userId = this.userId.replace(/\"/g, '');

    this.apollo.watchQuery({
      query: currentUserQuery,
      variables: {
        id: this.userId
      }
    }).subscribe(({data, loading}) => {
      this.currentUser = data['getUser'];
      this.brewFormService.addUserInfo(this.userId, this.currentUser);
    });

    // this.modalData = this.brewFormService.modalData;
    this.newBrewForm = this.brewFormService.newBrewForm;
    this.brewFormService.loadForm();

    // watch for changes to the form to calculate certain variables
    if (undefined !== this.newBrewForm.value) {
      Object.keys(this.newBrewForm.value.controls).forEach(key => {
        if ( 'brewFormAuto' !== key ) {
          const control = this.newBrewForm.value.get(key.toString());
          control.valueChanges.subscribe(value => {
            this.brewFormService.updateCalculations();
          });
        }
      });
    }
  }

  saveBrew() {
    this.loader = true;
    this.brewFormService.saveBrew((data) => {
      if ( undefined === data.createBrew ) {
        this.modalData = {
            title: 'Boil Over',
            body: 'There was a forge error saving this brew. Please try again later.',
            buttons: { close: true, dashboard: true }
          }
      } else {
        this.modalData = {
            title: data.createBrew.changedBrew.name+' saved. Have a homebrew!',
            body: '',
            buttons: { view: true, viewData: data.createBrew.changedBrew.id, dashboard: true }
          }
      }
      this.showModal = true;
    });
  }

  closeModal() {
    this.showModal = false;
    this.loader = false;
  }
}
