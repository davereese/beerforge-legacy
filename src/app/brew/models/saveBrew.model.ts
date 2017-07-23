import gql from 'graphql-tag';

export const saveBrewMutation = gql`
  mutation CreateBrew($brew: CreateBrewInput!) {
    createBrew(input: $brew) {
      changedBrew {
        id
      }
    }
  }
`;

export const saveMaltMutation = gql`
  mutation CreateMaltChoice($malt: CreateMaltChoiceInput!) {
    createMaltChoice(input: $malt) {
      changedMaltChoice {
        id
      }
    }
  }
`;

export const saveHopMutation = gql`
  mutation CreateHopChoice($hop: CreateHopChoiceInput!) {
    createHopChoice(input: $hop) {
      changedHopChoice {
        id
      }
    }
  }
`;

export const saveYeastMutation = gql`
  mutation CreateYeastChoice($yeast: CreateYeastChoiceInput!) {
    createYeastChoice(input: $yeast) {
      changedYeastChoice {
        id
      }
    }
  }
`;

