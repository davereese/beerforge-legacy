import gql from 'graphql-tag';

export const getMaltsQuery = gql`
  query {
    viewer {
      allMalts(orderBy: {field: name, direction: ASC}) {
        edges {
          node {
            id
            name
            color
            potential
          }
        }
      }
    }
  }
`;

export const getHopsQuery = gql`
  query {
    viewer {
      allHops(orderBy: {field: name, direction: ASC}) {
        edges {
          node {
            id
            name
            alphaAcid
          }
        }
      }
    }
  }
`;

export const getYeastsQuery = gql`
  query {
    viewer {
      allYeasts(orderBy: {field: name, direction: ASC}) {
        edges {
          node {
            id
            name
            lab
            attenuation
            temp
          }
        }
      }
    }
  }
`;
