import gql from 'graphql-tag';

export const currentUser = gql`
  query currentUser($id: ID!) {
    getUser(id: $id) {
      firstName,
      lastName,
      username,
      profilePic {
        defaultPicNumber,
        blobUrl
      },
      Brews {
        edges {
          node {
            id
            name
            createdAt
          }
        }
      }
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
