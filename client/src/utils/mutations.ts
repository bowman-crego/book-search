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
 mutation saveBook($bookData: Book!) {
    saveBook(bookData: $bookData) {
      _id
      username
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
    `;

export const REMOVE_BOOK= gql`
  mutation removeBook($profileId: ID!, $book: String!) {
    removeBook(bookId: $bookId, book: $book) {
      _id
      name
      books
    }
  }
`;