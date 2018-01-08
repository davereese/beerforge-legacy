import gql from 'graphql-tag';

export const badgeQuery = gql`
  query badgeQuery($id: ID!) {
    getBadge(id: $id) {
      id
      blobUrl
      title
      description
    }
  }
`;

export const addAchievementMutation = gql`
mutation AddToAchievementConnection($badge: AddToAchievementConnectionInput!) {
  addToAchievementConnection(input: $badge) {
    changedAchievement {
      badge {
        id
        blobUrl
        title
        description
      }
    }
  }
}
`;

export const addBrewAchievementMutation = gql`
mutation AddToBrewAchievementConnection($badge: AddToBrewAchievementConnectionInput!) {
  addToBrewAchievementConnection(input: $badge) {
    changedBrewAchievement {
      badge {
        id
        blobUrl
        title
        description
      }
    }
  }
}
`;
