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
