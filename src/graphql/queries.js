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
    users(where: { _or: [{ username: { _eq: $input } }, { phone_number: { _eq: $input } }] }) {
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
    users(where: { _or: [{ username: { _ilike: $query } }, { name: { _ilike: $query } }] }) {
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
      posts(order_by: { created_at: desc }) {
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
      save_posts(order_by: { created_at: desc }) {
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

export const SUGGEST_USER = gql`
  query suggestUser($limit: Int!, $followerIds: [uuid!]!, $createdAt: timestamptz!) {
    users(
      limit: $limit
      where: { _or: [{ id: { _in: $followerIds } }, { created_at: { _gt: $createdAt } }] }
    ) {
      id
      username
      name
      profile_image
    }
  }
`;

export const EXPLORE_POSTS = gql`
  query explorePost($feedIds: [uuid!]!) {
    posts(
      order_by: {
        created_at: desc
        likes_aggregate: { count: desc }
        comments_aggregate: { count: desc }
      }
      where: { user_id: { _nin: $feedIds } }
    ) {
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
`;

export const MORE_POST_FROM_USER = gql`
  query morePostFromUser($userId: uuid!, $postId: uuid!) {
    posts(where: { user_id: { _eq: $userId }, id: { _neq: $postId } }, limit: 6) {
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
`;

export const GET_POST = gql`
  query getPost($postId: uuid!) {
    posts_by_pk(id: $postId) {
      id
      user {
        id
        username
      }
    }
  }
`;

export const GET_FEED = gql`
  query getFeed($limit: Int!, $feedIds: [uuid!]!, $lastTimestamp: timestamptz) {
    posts(
      order_by: { created_at: desc }
      limit: $limit
      where: { user_id: { _in: $feedIds }, created_at: { _lt: $lastTimestamp } }
    ) {
      id
      caption
      media
      location
      created_at
      user {
        id
        username
        name
        profile_image
      }
      likes {
        id
        user_id
        post_id
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments(order_by: { created_at: desc }, limit: 2) {
        content
        created_at
        id
        user {
          username
        }
      }
      save_posts {
        id
        user_id
      }
    }
  }
`;
