import gql from 'graphql-tag';

export const styleTagsQuery = gql`
  query styleTags($style: Boolean) {
    viewer {
      allTags(where: {style: {eq: $style}}, orderBy: {field: tagName, direction:ASC}) {
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
