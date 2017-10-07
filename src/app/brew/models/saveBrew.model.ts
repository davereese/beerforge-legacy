import gql from 'graphql-tag';

export const saveBrewMutation = gql`
  mutation CreateBrew($brew: CreateBrewInput!) {
    createBrew(input: $brew) {
      changedBrew {
        id
        name
      }
    }
  }
`;

export const updateBrewMutation = gql`
mutation UpdateBrew($brew: UpdateBrewInput!) {
  updateBrew(input: $brew) {
    changedBrew {
      id
      name
    }
  }
}
`;

export const deleteBrewMutation = gql`
mutation DeleteBrew($brewId: DeleteBrewInput!) {
  deleteBrew(input: $brewId) {
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

export const updateMaltMutation = gql`
mutation UpdateMaltChoice($malt: UpdateMaltChoiceInput!) {
  updateMaltChoice(input: $malt) {
    changedMaltChoice {
      id
    }
  }
}
`;

export const deleteMaltMutation = gql`
mutation DeleteMaltChoice($choiceID: DeleteMaltChoiceInput!) {
  deleteMaltChoice(input: $choiceID) {
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

export const updateHopMutation = gql`
mutation UpdateHopChoice($hop: UpdateHopChoiceInput!) {
  updateHopChoice(input: $hop) {
    changedHopChoice {
      id
    }
  }
}
`;

export const deleteHopMutation = gql`
mutation DeleteHopChoice($choiceID: DeleteHopChoiceInput!) {
  deleteHopChoice(input: $choiceID) {
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

export const updateYeastMutation = gql`
mutation UpdateYeastChoice($yeast: UpdateYeastChoiceInput!) {
  updateYeastChoice(input: $yeast) {
    changedYeastChoice {
      id
    }
  }
}
`;

export const deleteYeastMutation = gql`
mutation DeleteYeastChoice($choiceID: DeleteYeastChoiceInput!) {
  deleteYeastChoice(input: $choiceID) {
    changedYeastChoice {
      id
    }
  }
}
`;
