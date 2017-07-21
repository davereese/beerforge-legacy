import gql from 'graphql-tag';

export const saveBrewMutation = gql`
  mutation CreateBrew($brew: CreateBrewInput!) {
    createBrew(input: $brew) {
      changedBrew {
        name
        batchNum
        batchType
        batchSize
        batchEfficiency
        strikeTemp
        mashTemp
        mashWaterVol
        mashTime
        spargeTemp
        spargeWaterVol
        preBoilGravity
        boilWaterVol
        boilTime
        evaporationRate
        originalGravity
        fermentTemp
        fermentTime
        fermentSecTemp
        fermentSecTime
        finalGravity
        packaging
        carbonateCo2Vol
        carbonateTemp
        carbonateType
      }
    }
  }
`;
