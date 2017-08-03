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

@Pipe({name: 'round'})
export class round implements PipeTransform {
  transform(number:number): number {
    return Math.round(number * 100) / 100;
  }
}

@Pipe({name: 'gravityUnits'})
export class gravityUnits implements PipeTransform {
  transform(gravity:number): string {
    return (gravity).toFixed(3);
  }
}
