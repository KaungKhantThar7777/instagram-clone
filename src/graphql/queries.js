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

export const GET_USER = gql`
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
