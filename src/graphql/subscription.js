const { gql } = require("apollo-boost");

export const ME = gql`
  subscription me($userId: String!) {
    users(where: { user_id: { _eq: $userId } }) {
      id
      user_id
      name
      username
      profile_image
      last_checked
    }
  }
`;

export const GET_POST = gql`
  subscription getPost($postId: uuid!) {
    posts_by_pk(id: $postId) {
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
      comments(order_by: { created_at: desc }) {
        content
        created_at
        id
        user {
          profile_image
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
