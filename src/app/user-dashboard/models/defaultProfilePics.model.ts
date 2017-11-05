import gql from 'graphql-tag';

export const DefaultProfilePicsQuery = gql`
  query defaultProfilePic($num: String) {
    viewer {
      allProfilePics(where: {defaultPicNumber: {eq: $num}}) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;
