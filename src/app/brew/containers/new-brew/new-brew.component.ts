import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Brew } from '../../models/brew.interface';
import { User } from '../../../user-dashboard/models/user.interface';
import { currentUserQuery } from '../../../user-dashboard/models/getUser.model';
import { flipInOut } from '../../../animations/flip-in-out';
import { modalPop } from '../../../animations/modal-pop';
import { modalData } from '../../../modal/models/modal.model';
import { UserService } from '../../../services/user.service';
import { BrewFormService } from '../../../services/brewForm.service';
import { BrewCalcService } from '../../../services/brewCalc.service';

@Component({
  selector: 'new-brew',
  styleUrls: ['new-brew.component.scss'],
  templateUrl: './new-brew.component.html',
  animations: [
    flipInOut,
    modalPop
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
        id: this.userId,
        first: 1
      }
    }).subscribe(({data, loading}) => {
      this.currentUser = data['getUser'];
      this.brewFormService.addUserInfo(this.userId, this.currentUser);
    });

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
    this.brewFormService.saveBrew(null, (data) => {
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
