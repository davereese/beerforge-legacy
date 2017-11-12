import gql from 'graphql-tag';

export const updateProfileMutation = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      changedUser {
        id
        firstName,
        lastName,
        username,
        email,
        city,
        state,
        profilePic {
          id
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
  }
`;

export const deleteProfilePicMutation = gql`
  mutation DeleteProfilePic($input: DeleteProfilePicInput!) {
    deleteProfilePic(input: $input) {
      changedProfilePic {
        id
      }
    }
  }
`;