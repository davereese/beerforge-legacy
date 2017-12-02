import gql from 'graphql-tag';

export const currentUserTagsQuery = gql`
  query currentUserTags($id: ID!) {
    viewer {
      allTags(where: {userId: {eq: $id}}, orderBy: {field: tagName, direction: ASC}) {
        edges {
          node {
            id
            tagName
          }
        }
      }
    }
  }
`;
