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
