import gql from 'graphql-tag';

export const currentBrewQuery = gql`
  query currentBrew($user_id: ID!, $brew_id: ID!) {
    viewer {
      allBrews(where: {userId: {eq: $user_id}, id: {eq: $brew_id}}) {
        edges {
          node {
            name
            createdAt
          }
        }
      }
    }
  }
`;
