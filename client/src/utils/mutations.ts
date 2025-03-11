import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
export const ADD_USER= gql`
    mutation addUser($username: String!, $email: String!, $password: String!)
     { 
    }
  }
`;

export const SAVE_BOOK= gql`
  mutation addSkill($profileId: ID!, $skill: String!) {
    addSkill(profileId: $profileId, skill: $skill) {
      _id
      name
      skills
    }
  }
    `;

export const REMOVE_BOOK= gql`
  mutation removeSkill($profileId: ID!, $skill: String!) {
    removeSkill(profileId: $profileId, skill: $skill) {
      _id
      name
      skills
    }
  }
`;