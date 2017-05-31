import { Injectable } from '@angular/core';

@Injectable()
export class BrewService {
  calculateIBUs(hop:any, time:number, vol:number, bGravity:number): number {
    // f(G) = 1.65 * 0.000125^(bG - 1)              -  Gravity factor
    // f(T) = [1 - e^(-0.04 x T)] / 4.15            -  Time factor
    // U% = f(G) * f(T)                             -  Utilization percentage
    // Cgrav = 1 + [(bG - 1.050) / 0.2]             -  Correction for worts with bGravity above 1.050
    // IBU = Woz * U% * A% * 7489 / Vgal * Cgrav    -  International Bitterness Units (mg/liter)

    let fG: number,
        fT: number,
        U: number,
        Cgrav: number,
        IBU: number;

    fG = Math.pow((1.65 * 0.000125),(bGravity - 1));
    fT = ( 1-Math.exp(-0.04 * time) )/4.15;
    U = fG * fT;
    Cgrav = 1 + ((bGravity - 1.050) / 0.2);
    IBU = Math.round( (hop.amount * U * hop.alphaAcid * 74.89 / vol * Cgrav) * 100 ) / 100;

    return IBU;
  }

  convertToPlato(SG: number): number {
    // E = -668.962 + (1262.45 * SG) - (776.43 * SG^2) + (182.94 * SG^3)  - specific gravity to plato
    let E = -668.962 + (1262.45 * SG) - (776.43 * Math.pow(SG, 2)) + (182.94 * Math.pow(SG, 3));
    return E;
  }

  calculateRealExtract(OE: number, AE: number): number {
    // RE = (0.8114 * AE) + (0.1886 * OE)                - real extract
    let RE = (0.8114 * AE) + (0.1886 * OE);
    return RE;
  }

  calculateABV(OG: number, FG: number):number {
    // ABW = (OE - RE) / (2.0665 - (.010665 * OE) )      - alcohol by weight
    // ABV = (ABW * (FG / .794) )                        - alcohol by vol

    let OE: number,
        AE: number,
        RE: number,
        ABW: number,
        ABV: number;

    OE = this.convertToPlato(OG);
    AE = this.convertToPlato(FG);
    RE = this.calculateRealExtract(OE, AE);
    ABW = (OE - RE) / (2.0665 - (.010665 * OE) );
    ABV = Math.round( (ABW * (FG / .794) ) * 100 ) / 100;

    return ABV;
  }

  calculateAttenuation(OG: number, FG: number): number {
    // A = 100 * (OG – FG)/(OG – 1.0)
    let A = Math.round( (100 * (OG - FG)/(OG - 1.0)) * 10 ) / 10;
    return A;
  }

  calculateSRM(malts: any, vol: number):number {
    // MCU = (grain_color * grain_weight_lbs)/volume_gallons    - Malt Color Units
    // SRM = 1.4922 * [MCU ^ 0.6859]                            - The more accurate Morey equation
    let MCU: number = 0,
        SRM: number;

    for ( let i = 0; i < malts.length; i++ ) {
      MCU += (malts[i].node.malt.color * malts[i].node.amount)/vol;
    }

    SRM = Math.round( (1.4922 * Math.pow(MCU, 0.6859)) * 10 ) / 10;

    return SRM;
  }

  calculateCO2(temp: number, vol: number, type: string): number {
    let P;

    if ( 'forced' === type ) {
      // P = -16.6999 - 0.0101059*T + 0.00116512*T^2 + 0.173354*T*V + 4.24267*V - 0.0684226*V^2
      P = Math.round( (-16.6999 - (0.0101059 * temp) + (0.00116512 * Math.pow(temp, 2)) + (0.173354 * temp * vol) + (4.24267 * vol) - (0.0684226 * Math.pow(vol, 2))) * 100 ) / 100;
    }

    return P;
  }
}
