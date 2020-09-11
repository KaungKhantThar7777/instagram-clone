const { gql } = require("apollo-boost");

export const FIND_USERS = gql`
  query MyQuery($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;
