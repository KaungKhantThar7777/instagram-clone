const { gql } = require("apollo-boost");

export const FIND_USERS = gql`
  query MyQuery($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;

export const GET_USER_EMAIL = gql`
  query getUserEmail($input: String!) {
    users(
      where: {
        _or: [{ username: { _eq: $input } }, { phone_number: { _eq: $input } }]
      }
    ) {
      email
    }
  }
`;

export const GET_USER_BY_PK = gql`
  query MyQuery($id: uuid!) {
    users_by_pk(id: $id) {
      id
      bio
      email
      phone_number
      profile_image
      name
      website
      username
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query MyQuery($username: String!) {
    users(where: { username: { _eq: $username } }) {
      id
      bio
      email
      phone_number
      profile_image
      name
      website
      username
    }
  }
`;

export const SEARCH_USERS = gql`
  query searchUsers($query: String!) {
    users(
      where: {
        _or: [{ username: { _ilike: $query } }, { name: { _ilike: $query } }]
      }
    ) {
      username
      profile_image
      name
      id
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query getUserProfile($username: String!) {
    users(where: { username: { _eq: $username } }) {
      id
      bio
      name
      username
      website
      profile_image
      posts_aggregate {
        aggregate {
          count
        }
      }
      posts {
        id
        media
        comments_aggregate {
          aggregate {
            count
          }
        }
        likes_aggregate {
          aggregate {
            count
          }
        }
      }
      followings_aggregate(where: {}) {
        aggregate {
          count
        }
      }
      followers_aggregate(where: {}) {
        aggregate {
          count
        }
      }
      save_posts {
        post {
          id
          media
          comments_aggregate {
            aggregate {
              count
            }
          }
          likes_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`;
