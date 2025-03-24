const typeDefs = `

type User {
_id: ID!
username: String!
email: String!
password: String!
savedBooks: [Book]
}


type Book {
    authors: [String!]
    description: String!
    bookId: ID!
    image: String
    link: String
    title: String!
    
    }

 type Auth {
  token: ID!
  user: User
  book: Book
 }
  
type Query {
me: User
AddBook(bookId: String!, title: String!, authors: [String], description: String!, image: String, link: String): Book
}

input BookInput {
    authors: [String!]
    description: String!
    bookId: String! 
    image: String
    link: String
    title: String!
}

type Mutation {
login(email: String!, password: String!): Auth
addUser(username: String!, email: String!, password: String!): Auth
saveBook(bookData: BookInput): User
removeBook(bookId: String!): User
}

`;


export default typeDefs;

