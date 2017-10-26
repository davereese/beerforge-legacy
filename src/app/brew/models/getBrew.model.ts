import gql from 'graphql-tag';

export const currentBrewQuery = gql`
  query currentBrew($brew_id: ID!) {
    getBrew(id: $brew_id) {
      id
      name
      createdAt
      batchNum
      batchType
      batchSize
      batchEfficiency
      maltChoice(orderBy: {field: amount, direction: DESC}) {
        edges {
          node {
            id
            malt {
              id
              name
              color
              potential
            }
            amount
          }
        }
      }
      hopChoice(orderBy: {field: time, direction: DESC}) {
        edges {
          node {
            id
            hop {
              id
              name
            }
            amount
            time
            alphaAcid
          }
        }
      }
      yeastChoice {
        edges {
          node {
            id
            yeast {
              id
              lab
              name
              attenuation
            }
            amount
            package
          }
        }
      }
      waterToGrain
      initialGrainTemp
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
      User {
        id
      }
    }
  }
`;
