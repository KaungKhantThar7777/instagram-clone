const { gql } = require("apollo-boost");

export const CREATE_USER = gql`
  mutation createUser(
    $userId: String!
    $email: String!
    $name: String!
    $username: String!
    $website: String!
    $bio: String!
    $phoneNumber: String!
    $profileImage: String!
  ) {
    insert_users_one(
      object: {
        email: $email
        username: $username
        name: $name
        website: $website
        user_id: $userId
        bio: $bio
        profile_image: $profileImage
        phone_number: $phoneNumber
      }
    ) {
      id
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $id: uuid!
    $bio: String!
    $name: String!
    $email: String!
    $username: String!
    $website: String!
    $phoneNumber: String!
  ) {
    update_users(
      where: { id: { _eq: $id } }
      _set: {
        bio: $bio
        email: $email
        name: $name
        phone_number: $phoneNumber
        username: $username
        website: $website
      }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_AVATAR = gql`
  mutation updateUser($id: uuid!, $profileImage: String!) {
    update_users(
      where: { id: { _eq: $id } }
      _set: { profile_image: $profileImage }
    ) {
      affected_rows
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost(
    $caption: String!
    $location: String!
    $media: String!
    $userId: uuid!
  ) {
    insert_posts(
      objects: {
        caption: $caption
        location: $location
        media: $media
        user_id: $userId
      }
    ) {
      affected_rows
    }
  }
`;

export const LIKE_POST = gql`
  mutation likePost($postId: uuid!, $userId: uuid!, $profileId: uuid!) {
    insert_likes(objects: { post_id: $postId, user_id: $userId }) {
      affected_rows
    }
    insert_notifications(
      objects: {
        post_id: $postId
        profile_id: $profileId
        user_id: $userId
        type: "like"
      }
    ) {
      affected_rows
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation unlikePost($postId: uuid!, $userId: uuid!, $profileId: uuid!) {
    delete_likes(
      where: { post_id: { _eq: $postId }, user_id: { _eq: $userId } }
    ) {
      affected_rows
    }
    delete_notifications(
      where: {
        post_id: { _eq: $postId }
        profile_id: { _eq: $profileId }
        user_id: { _eq: $userId }
        type: { _eq: "like" }
      }
    ) {
      affected_rows
    }
  }
`;

export const SAVE_POST = gql`
  mutation savePost($postId: uuid!, $userId: uuid!) {
    insert_saved_posts(objects: { post_id: $postId, user_id: $userId }) {
      affected_rows
    }
  }
`;

export const UNSAVE_POST = gql`
  mutation unsavePost($postId: uuid!, $userId: uuid!) {
    delete_saved_posts(
      where: { post_id: { _eq: $postId }, user_id: { _eq: $userId } }
    ) {
      affected_rows
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation createComment($content: String!, $postId: uuid!, $userId: uuid!) {
    insert_comments(
      objects: { content: $content, post_id: $postId, user_id: $userId }
    ) {
      affected_rows
    }
  }
`;

export const CHECK_NOTIFICATIONS = gql`
  mutation checkNotifications($userId: uuid!, $lastChecked: String!) {
    update_users_by_pk(
      pk_columns: { id: $userId }
      _set: { last_checked: $lastChecked }
    ) {
      last_checked
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation followUser($userIdToFollow: uuid!, $currentUserId: uuid!) {
    insert_followings(
      objects: { user_id: $currentUserId, profile_id: $userIdToFollow }
    ) {
      affected_rows
    }
    insert_followers(
      objects: { user_id: $userIdToFollow, profile_id: $currentUserId }
    ) {
      affected_rows
    }
    insert_notifications(
      objects: {
        user_id: $currentUserId
        profile_id: $userIdToFollow
        type: "follow"
      }
    ) {
      affected_rows
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation unfollowUser($userIdToFollow: uuid!, $currentUserId: uuid!) {
    delete_followings(
      where: {
        user_id: { _eq: $currentUserId }
        profile_id: { _eq: $userIdToFollow }
      }
    ) {
      affected_rows
    }
    delete_followers(
      where: {
        user_id: { _eq: $userIdToFollow }
        profile_id: { _eq: $currentUserId }
      }
    ) {
      affected_rows
    }

    delete_notifications(
      where: {
        user_id: { _eq: $currentUserId }
        profile_id: { _eq: $userIdToFollow }
        type: { _eq: "follow" }
      }
    ) {
      affected_rows
    }
  }
`;
