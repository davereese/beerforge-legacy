import gql from 'graphql-tag';

export const currentUserQuery = gql`
  query currentUser($id: ID!, $first: Int, $after: String, $last: Int, $before: String) {
    getUser(id: $id) {
      id
      firstName,
      lastName,
      username,
      profilePic {
        defaultPicNumber,
        blobUrl
      },
      Brews(first: $first, after: $after, last: $last, before: $before) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            batchNum
            name
            createdAt
            batchSize
            maltChoice(orderBy: {field: amount, direction: DESC}) {
              edges {
                node {
                  malt {
                    id
                    name
                    color
                  }
                  amount
                }
              }
            }
            hopChoice(orderBy: {field: time, direction: DESC}) {
              edges {
                node {
                  hop {
                    id
                    name
                  }
                  amount
                  time
                  alphaAcid
                }
              }
            }
            boilWaterVol
            preBoilGravity
            originalGravity
            finalGravity
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
