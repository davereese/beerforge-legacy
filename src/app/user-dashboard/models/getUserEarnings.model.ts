import gql from 'graphql-tag';

export const currentUserEarningsQuery = gql`
  query currentUserEarnings($id: ID!) {
    getUser(id: $id) {
      id
      Badges {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;
