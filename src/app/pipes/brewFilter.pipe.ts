import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'parseMash'})
export class parseMash implements PipeTransform {
  transform(value: string): string {
    let newStr: string = "";
    if ( 'allGrain' === value ) {
      newStr = 'All Grain';
    } else if ( 'partial' === value ) {
      newStr = 'Partial Mash';
    } else {
      newStr = value;
    }
    return newStr;
  }
}

@Pipe({name: 'ParseCo2Method'})
export class ParseCo2Method implements PipeTransform {
  transform(value: string): string {
    let newStr: string = "";
    if ('' !== value) {
      if ( 'cornSugar' === value ) {
        newStr = 'Corn Sugar';
      } else if ( 'caneSugar' === value ) {
        newStr = 'Cane Sugar';
      } else if ( 'dme' === value ) {
        newStr = 'DME';
      } else if ( 'forced' === value ) {
        newStr = 'Forced';
      }
    }
    return newStr;
  }
}

@Pipe({name: 'round'})
export class round implements PipeTransform {
  transform(number:number): number {
    return Math.round(number * 100) / 100;
  }
}

@Pipe({name: 'gravityUnits'})
export class gravityUnits implements PipeTransform {
  transform(gravity:number): string {
    return gravity.toFixed(3);
  }
}

@Pipe({name: 'fill'})
export class FillPipe implements PipeTransform {
  transform(value) {
    return (new Array(value)).fill(1);
  }
}