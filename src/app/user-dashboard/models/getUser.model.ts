import gql from 'graphql-tag';

export const currentUserQuery = gql`
  query currentUser($id: ID!) {
    getUser(id: $id) {
      id
      firstName,
      lastName,
      username,
      profilePic {
        defaultPicNumber,
        blobUrl
      },
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
