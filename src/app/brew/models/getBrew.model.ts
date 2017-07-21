import gql from 'graphql-tag';

export const currentBrewQuery = gql`
  query currentBrew($user_id: ID!, $brew_id: ID!) {
    viewer {
      allBrews(where: {userId: {eq: $user_id}, id: {eq: $brew_id}}) {
        edges {
          node {
            name
            createdAt
            batchNum
            batchType
            batchSize
            batchEfficiency
            maltChoice(orderBy: {field: amount, direction: DESC}) {
              edges {
                node {
                  malt {
                    id
                    name
                    color
                  }
                  amount
                }
              }
            }
            hopChoice(orderBy: {field: time, direction: DESC}) {
              edges {
                node {
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
                  yeast {
                    id
                    lab
                    name
                  }
                  amount
                  package
                }
              }
            }
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
    }
  }
`;
