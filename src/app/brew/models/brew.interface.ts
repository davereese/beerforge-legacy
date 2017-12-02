export interface Brew {
  id: string
  userId?: string,
  name: string
  createdAt?: Date
  batchNum?: number
  tags?: {
    edges: [gqlTag]
  }
  batchType?: string
  batchSize?: number
  batchEfficiency?: number
  maltChoice?: {
    edges: [gqlMalt]
  }
  hopChoice?: {
    edges: [gqlHop]
  }
  yeastChoice?: {
    edges: [gqlYeast]
  }
  strikeTemp?: number
  waterToGrain?: number
  mashTemp?: number
  initialGrainTemp?: number
  mashWaterVol?: number
  mashTime?: number
  spargeTemp?: number
  spargeWaterVol?: number
  preBoilGravity?: number
  boilWaterVol?: number
  boilTime?: number
  evaporationRate?: number
  originalGravity?: number
  fermentTemp?: number
  fermentTime?: number
  fermentSecTemp?: number
  fermentSecTime?: number
  finalGravity?: number
  packaging?: string
  carbonateCo2Vol?: number
  carbonateTemp?: number
  carbonateType?: string
  notes?: string
}

export interface gqlTag {
  node: {
    id: string
    tagName: string
  }
}

export interface Tag {
  id: string
  tagName: string
}

export interface gqlMalt {
  node: {
    malt: {
      id: string
      name: string
      color: number
    }
    amount: number
  }
}

export interface Malt {
  id: string
  name: string
  color: number
  potential: number
}

export interface gqlHop {
  node: {
    hop: {
      id: string
      name: string
    }
    amount: number
    time: number
    alphaAcid: number
  }
}

export interface Hop {
  id: string
  name: string
  alphaAcid: number
}

export interface gqlYeast {
  node: {
    yeast: {
      id: string
      lab: string
      name: string
    }
    amount: number
    package: string
  }
}

export interface Yeast {
  id: string
  lab: string
  name: string
  attenuation: number
  temp: number
}
