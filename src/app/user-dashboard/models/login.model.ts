import gql from 'graphql-tag';

export const LoginUserQuery = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user {
        id
      }
    }
  }
`;
