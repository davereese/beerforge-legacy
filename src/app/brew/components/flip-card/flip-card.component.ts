import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'flip-card',
  styleUrls: ['flip-card.component.scss'],
  templateUrl: './flip-card.component.html'
})
export class flipCardComponent implements OnChanges {
  editingType: string;
  cardTitle: string;
  addEnabled: boolean = false;

  @Input()
  detail: string;

  @Input()
  data: any;

  @Input()
  parent: FormGroup;

  @Output()
  cancelSave: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  next: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  addIngredient: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  editIngredient: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  remove: EventEmitter<any> = new EventEmitter<any>();

  ngOnChanges() {
    switch (this.detail) {
      case 'settings':
        this.cardTitle = 'Brew Settings';
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
          batchType: '',
          batchSize: '',
          sysEfficiency: '',
        });
        break;
      case 'fermentables':
        this.parent.get('brewFormFermentables').reset({
          fermentable: '',
          fermentableWeight: '',
        });
        break;
      case 'hops':
        this.parent.get('brewFormHops').reset({
          hop: '',
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
          yeastPackage: '',
          yeastAmount: ''
        });
        break;
      case 'mash':
        this.parent.get('brewFormMash').reset({
          targetMashTemp: '',
          waterToGrain: '',
          mashTime: '',
          spargeTemp: '',
        });
        break;
      case 'boil':
        this.parent.get('brewFormBoil').patchValue({
          boilTime: '',
        });
        break;
      case 'fermentation':
        this.parent.get('brewFormFermentation').reset({
          fermentTime: '',
          fermentTemp: '',
          fermentSecCheck: false,
          fermentSecTime: '',
          fermentSecTemp: '',
        });
        break;
      case 'packaging':
        this.parent.get('brewFormPackaging').reset({
          packageType: '',
          carbonationMethod: '',
          co2VolTarget: '',
          beerTemp: '',
        });
        break;
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

  enableAdd() {
    this.addEnabled = true;
  }

  disableAdd() {
    this.addEnabled = false;
  }

  handleAdd() {
    switch (this.detail) {
      case 'fermentables':
        this.addIngredient.emit(this.parent.get('brewFormFermentables').value);
        this.parent.get('brewFormFermentables').reset({
          fermentable: 0,
          fermentableWeight: '',
        });
        break;
      case 'hops':
        this.addIngredient.emit(this.parent.get('brewFormHops').value);
        this.parent.get('brewFormHops').reset({
          hop: '',
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
          yeastPackage: '',
          yeastAmount: ''
        });
        break;
    }
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
}
