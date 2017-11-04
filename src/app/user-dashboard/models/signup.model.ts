import gql from 'graphql-tag';

export const SignUpUserQuery = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      token
      changedUser {
        id
      }
    }
  }
`;
