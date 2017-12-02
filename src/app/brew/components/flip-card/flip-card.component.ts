import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Brew } from '../../models/brew.interface';

@Component({
  selector: 'flip-card',
  styleUrls: ['flip-card.component.scss'],
  templateUrl: './flip-card.component.html'
})
export class flipCardComponent implements OnChanges {
  editingType: string;
  cardTitle: string;
  addEnabled: boolean = false;

  @Input() detail: string;
  @Input() data: any;
  @Input() parent: FormGroup;
  @Input() currentBrew: Brew = null;
  @Output() cancelSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  @Output() addTag: EventEmitter<any> = new EventEmitter<any>();
  @Output() addIngredient: EventEmitter<any> = new EventEmitter<any>();
  @Output() editIngredient: EventEmitter<any> = new EventEmitter<any>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnChanges() {
    switch (this.detail) {
      case 'settings':
        this.cardTitle = 'Brew Settings';
        this.editingType = 'details';
        break;
      case 'tags':
        this.cardTitle = 'Manage Tags';
        this.editingType = 'details';
        break;
      case 'mash':
        this.cardTitle = 'Mash';
        this.editingType = 'details';
        break;
      case 'boil':
        this.cardTitle = 'Boil';
        this.editingType = 'details';
        break;
      case 'fermentation':
        this.cardTitle = 'Fermentation';
        this.editingType = 'details';
        break;
      case 'packaging':
        this.cardTitle = 'Packaging';
        this.editingType = 'details';
        break;
      case 'fermentables':
        this.cardTitle = 'Add Fermentable';
        this.editingType = 'ingredients';
        break;
      case 'editFermentable':
        this.cardTitle = 'Edit Fermentable';
        this.editingType = 'ingredients';
        break;
      case 'hops':
        this.cardTitle = 'Add Hop';
        this.editingType = 'ingredients';
        break;
      case 'editHop':
        this.cardTitle = 'Edit Hop';
        this.editingType = 'ingredients';
        break;
      case 'adjuncts':
        this.cardTitle = 'Add Adjunct';
        this.editingType = 'ingredients';
        break;
      case 'editAdjunct':
        this.cardTitle = 'Edit Adjunct';
        this.editingType = 'ingredients';
        break;
      case 'yeasts':
        this.cardTitle = 'Add Yeast';
        this.editingType = 'ingredients';
        break;
      case 'editYeast':
        this.cardTitle = 'Edit Yeast';
        this.editingType = 'ingredients';
        break;
    }
  }

  handleCancel() {
    switch (this.detail) {
      case 'settings':
        this.parent.get('brewFormSettings').reset({
          batchType: null !== this.currentBrew ? this.currentBrew.batchType : '',
          batchSize: null !== this.currentBrew ? this.currentBrew.batchSize : '',
          sysEfficiency: null !== this.currentBrew ? this.currentBrew.batchEfficiency : '',
        });
        break;
      case 'tags':
        this.parent.get('brewFormTags').reset({
          tag: '',
          tagId: '',
          new: false
        });
        break;
      case 'fermentables':
        this.parent.get('brewFormFermentables').reset({
          fermentable: '',
          fermentableId: 0,
          fermentableWeight: '',
        });
        break;
      case 'hops':
        this.parent.get('brewFormHops').reset({
          hop: '',
          hopId: 0,
          hopAlphaAcid: '',
          hopTime: '',
          hopWeight: ''
        });
        break;
      case 'adjuncts':
        break;
      case 'yeasts':
       this.parent.get('brewFormYeasts').reset({
          yeast: '',
          yeastId: 0,
          yeastPackage: '',
          yeastAmount: ''
        });
        break;
      case 'mash':
        this.parent.get('brewFormMash').reset({
          targetMashTemp: null !== this.currentBrew ? this.currentBrew.mashTemp : '',
          waterToGrain: null !== this.currentBrew ? this.currentBrew.waterToGrain : '',
          initialGrainTemp: null !== this.currentBrew ? this.currentBrew.initialGrainTemp : '',
          mashTime: null !== this.currentBrew ? this.currentBrew.mashTime : '',
          spargeTemp: null !== this.currentBrew ? this.currentBrew.spargeTemp : '',
        });
        break;
      case 'boil':
        this.parent.get('brewFormBoil').patchValue({
          boilTime: null !== this.currentBrew ? this.currentBrew.boilTime : '',
        });
        break;
      case 'fermentation':
        this.parent.get('brewFormFermentation').reset({
          fermentTime: null !== this.currentBrew ? this.currentBrew.fermentTime : '',
          fermentTemp: null !== this.currentBrew ? this.currentBrew.fermentTemp : '',
          fermentSecCheck: false,
          fermentSecTime: null !== this.currentBrew ? this.currentBrew.fermentSecTime : '',
          fermentSecTemp: null !== this.currentBrew ? this.currentBrew.fermentSecTemp : '',
        });
        break;
      case 'packaging':
        this.parent.get('brewFormPackaging').reset({
          packageType: null !== this.currentBrew ? this.currentBrew.packaging : '',
          carbonationMethod: null !== this.currentBrew ? this.currentBrew.carbonateType : '',
          co2VolTarget: null !== this.currentBrew ? this.currentBrew.carbonateCo2Vol : '',
          beerTemp: null !== this.currentBrew ? this.currentBrew.carbonateTemp : '',
        });
        break;
    }

    if ( this.checkForIngredients() ) {
      this.parent.markAsDirty();
    }
    this.cancelSave.emit();
  }

  handleSave() {
    this.cancelSave.emit();
  }

  handleNext(event) {
    this.addEnabled = false;
    this.next.emit();
    event.srcElement.blur();
  }

  handleDelete() {
    this.delete.emit();
  }

  enableAdd() {
    this.addEnabled = true;
  }

  disableAdd() {
    this.addEnabled = false;
  }

  removeTag(event) {
    this.remove.emit(event);
  }

  handleAdd() {
    switch (this.detail) {
      case 'tags':
        this.addTag.emit(this.parent.get('brewFormTags').value);
        this.parent.get('brewFormTags').reset({
          tag: ''
        });
        break;
      case 'fermentables':
        this.addIngredient.emit(this.parent.get('brewFormFermentables').value);
        this.parent.get('brewFormFermentables').reset({
          fermentable: '',
          fermentableId: 0,
          fermentableWeight: '',
        });
        break;
      case 'hops':
        this.addIngredient.emit(this.parent.get('brewFormHops').value);
        this.parent.get('brewFormHops').reset({
          hop: '',
          hopId: 0,
          hopAlphaAcid: '',
          hopTime: '',
          hopWeight: ''
        });
        break;
      case 'adjuncts':
        this.addIngredient.emit(this.parent.get('brewFormAdjuncts').value);
        break;
      case 'yeasts':
        this.addIngredient.emit(this.parent.get('brewFormYeasts').value);
        this.parent.get('brewFormYeasts').reset({
          yeast: '',
          yeastId: 0,
          yeastPackage: 0,
          yeastAmount: ''
        });
        break;
    }
    this.parent.markAsDirty();
  }

  handleEdit() {
    let editedIngredient;
    switch (this.detail) {
      case 'editFermentable':
        editedIngredient = this.parent.get('brewFormFermentables').value;
        break;
      case 'editHop':
        editedIngredient = this.parent.get('brewFormHops').value;
        break;
      case 'editAdjunct':
        editedIngredient = this.parent.get('brewFormAdjuncts').value;
        break;
      case 'editYeast':
        editedIngredient = this.parent.get('brewFormYeasts').value;
        break;
    }
    editedIngredient.index = this.data.index;
    this.editIngredient.emit(editedIngredient);
    this.cancelSave.emit();
  }

  handleRemove() {
    let detail = this.detail,
        index = this.data.index;
    this.remove.emit({detail, index});
  }

  checkForIngredients(): boolean {
    let dirty = false;
    if ( null === this.currentBrew && 
      0 < this.parent.value.fermentables.length ||
      0 < this.parent.value.hops.length ||
      0 < this.parent.value.yeasts.length ||
      0 < this.parent.value.adjuncts.length ) {
      dirty = true;
    }
    return dirty;
  }
}
