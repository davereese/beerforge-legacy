import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { flipInOut } from '../../../animations/flip-in-out';
import { modalPop } from '../../../animations/modal-pop';
import { modalData } from '../../../modal/models/modal.model';

import { Brew } from '../../models/brew.interface';
import { User } from '../../../user-dashboard/models/user.interface';

import { UserBrewsService } from '../../../services/userBrews.service';
import { BrewFormService } from '../../../services/brewForm.service';
import { BrewCalcService } from '../../../services/brewCalc.service';

@Component({
  selector: 'new-brew',
  styleUrls: ['new-brew.component.scss'],
  templateUrl: './new-brew.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    flipInOut,
    modalPop
  ]
})
export class newBrewComponent implements OnInit, OnDestroy {
  loader: boolean = false;
  modalData: modalData;
  showModal: boolean = false;
  first: number = 1;
  userBrews: Array<Brew>;
  brewsSubscription: Subscription;
  brewName: string = 'New Brew';
  editingName: boolean = false;
  editingData: any = {};
  userId: string;
  flipCard: boolean = false;
  editingSection: string;
  newBrewForm: BehaviorSubject<FormGroup>; // form inputs
  editingNotes: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userBrewsService: UserBrewsService,
    private brewFormService: BrewFormService,
    private brewCalcService: BrewCalcService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.newBrewForm = this.brewFormService.newBrewForm;
    this.brewFormService.loadForm();

    this.brewsSubscription = this.userBrewsService.brews$.subscribe(brews => {
      this.userBrews = brews['brews'];
      if (this.userBrews) {
        this.userId = localStorage.getItem('user_id');
        this.brewFormService.addUserInfo(this.userId, this.userBrews);
      } else {
        this.userBrewsService.loadInitialData(this.first);
      }
      this.changeDetectorRef.detectChanges();
    });

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

  editNotes() {
    this.editingNotes = true;
  }

  fitNotesHeight(element) {
    if (element.target) {
      element.target.style.height = "auto";
      element.target.style.height = (element.target.scrollHeight + 25)+"px";
    }
  }

  closeNotes() {
    this.editingNotes = false;
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

  addTag(tag) {
    this.brewFormService.addTag(tag);
  }

  addIngredient(ingredient) {
    this.brewFormService.addIngredient(ingredient);
  }

  editIngredient(ingredient) {
    this.brewFormService.editIngredient(ingredient);
  }

  removeItem(item) {
    if (item.detail) { // its an ingredient
      this.brewFormService.removeIngredient(item);
      this.closeTheCard();
    } else { // its a tag
      this.brewFormService.removeTag(item);
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
      this.userBrewsService.refetchData();
      this.changeDetectorRef.detectChanges();
    });
  }

  closeModal() {
    this.showModal = false;
    this.loader = false;
  }

  ngOnDestroy() {
    if (undefined !== this.brewsSubscription) {
      this.brewsSubscription.unsubscribe();
    }
  }
}
