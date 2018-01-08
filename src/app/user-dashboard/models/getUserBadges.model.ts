import gql from 'graphql-tag';

export const currentUserBadgesQuery = gql`
query currentUserBadges($id: ID!) {
  viewer {
    allBadges(where: {Users: {node: {id: {eq: $id}}}}, first: 100) {
      edges {
        node {
          id
          blobUrl
          title
          description
        }
      }
    }
  }
}
`;
