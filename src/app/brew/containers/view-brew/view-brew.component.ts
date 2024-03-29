import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Brew } from '../../models/brew.interface';
import { flipInOut } from '../../../animations/flip-in-out';
import { modalPop } from '../../../animations/modal-pop';

import { modalData } from '../../../modal/models/modal.model';
import { currentBrewQuery } from '../../models/getBrew.model';

import { ViewBrewService } from './view-brew.service';
import { BrewFormService } from '../../../services/brewForm.service';
import { BrewCalcService } from '../../../services/brewCalc.service';
import { UserBrewsService } from 'app/services/userBrews.service';


@Component({
  selector: 'view-brew',
  styleUrls: ['view-brew.component.scss'],
  templateUrl: './view-brew.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    flipInOut,
    modalPop
  ]
})
export class viewBrewComponent implements OnInit, OnDestroy {
  loader: boolean = false;
  modalData: modalData;
  showModal: boolean = false;
  userId: string;
  brewId: string;
  brewSubscription: Subscription;
  currentBrew: Brew;
  brewForm: FormGroup;
  newBrewForm: BehaviorSubject<FormGroup>;
  editingData: any = {};
  flipCard: boolean = false;
  editingSection: string;
  editingNotes: boolean = false;

  constructor(
    private viewBrewService: ViewBrewService,
    private brewFormService: BrewFormService,
    private brewCalcService: BrewCalcService,
    private userBrewsService: UserBrewsService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.route.params
      .subscribe(params => {
        this.brewId = params['id'];
      });
  }

  ngOnInit() {
    this.newBrewForm = this.brewFormService.newBrewForm;

    this.viewBrewService.getCurrentBrew(this.brewId);
    this.brewSubscription = this.viewBrewService.currentBrew$.subscribe(brew => {
      this.currentBrew = brew;

      this.brewFormService.loadForm(this.currentBrew);

      // watch for changes to the form to calculate certain variables
      if (undefined !== this.newBrewForm.value) {
        Object.keys(this.newBrewForm.value.controls).forEach(key => {
          if ( 'brewFormAuto' !== key ) {
            const control = this.newBrewForm.value.get(key.toString());
            control.valueChanges.subscribe(value => {
              this.brewFormService.updateCalculations(this.currentBrew);
            });
          }
        });
      }
      this.changeDetectorRef.detectChanges();
    });
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
    this.newBrewForm.value.markAsDirty();
    if (item.detail) { // its an ingredient
      this.brewFormService.removeIngredient(item);
      this.closeTheCard();
    } else { // its a tag
      this.brewFormService.removeTag(item);
    }
  }

  deleteBrew() {
    this.brewFormService.deleteBrew(this.currentBrew, (data) => {
      if ( undefined === data.deleteBrew ) {
        this.modalData = {
            title: 'Boil Over',
            body: 'There was a forge error deleting this brew. Please try again later.',
            buttons: { close: true, dashboard: true }
          }
      } else {
        this.modalData = {
          title: 'Brew deleted.',
          body: '',
          buttons: { dashboard: true, newBrew: true }
        }
      }
      this.showModal = true;
      this.userBrewsService.refetchData();
      this.changeDetectorRef.detectChanges();
    });
  }

  saveBrew() {
    this.loader = true;
    this.brewFormService.saveBrew(this.currentBrew, (data) => {
      if ( undefined === data.updateBrew ) {
        this.modalData = {
            title: 'Boil Over',
            body: 'There was a forge error updating this brew. Please try again later.',
            buttons: { close: true, dashboard: true }
          }
      } else {
        this.modalData = {
            title: data.updateBrew.changedBrew.name+' updated. Have a homebrew!',
            body: '',
            buttons: { close: true, dashboard: true }
          }
      }
      this.showModal = true;
      this.changeDetectorRef.detectChanges();
    });
  }

  deleteBrewCheck() {
    this.loader = true;
    this.modalData = {
      title: 'Delete '+this.currentBrew.name+'!',
      body: 'Are you sure you want to permanently delete this brew?',
      buttons: { yes: true, close: true, closeData: 'No' }
    }
    this.showModal = true;
  }

  closeModal(event) {
    this.showModal = false;
    if ('delete' === event) {
      this.deleteBrew();
    } else {
      this.viewBrewService.refetchCurrentBrew();
      this.loader = false;
    }
  }

  ngOnDestroy() {
    // clear things
    if (undefined !== this.brewSubscription) {
      this.brewSubscription.unsubscribe();
      this.newBrewForm.next(null);
      this.currentBrew = null;
    }
  }
}
