export interface Brew {
  name: string
  createdAt: Date
  batchNum: number
  batchType: string
  batchSize: number
  batchEfficiency: number
  maltChoice: {
    edges: [Malt]
  }
  hopChoice: {
    edges: [Hop]
  }
  yeastChoice: {
    edges: [Yeast]
  }
  strikeTemp?: number
  mashTemp?: number
  mashWaterVol?: number
  mashTime?: number
  spargeTemp?: number
  spargeWaterVol?: number
  preBoilGravity: number
  boilWaterVol: number
  boilTime: number
  originalGravity: number
  fermentTemp: number
  fermentTime: number
  fermentSecTemp?: number
  fermentSecTime?: number
  finalGravity: number
  packaging: string
  carbonateCo2Vol: number
  carbonateTemp: number
  carbonateType: string
}

export interface Malt {
  node: {
    malt: {
      id: string
      name: string
      color: number
    }
    amount: number
  }
}

export interface Hop {
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

export interface Yeast {
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
