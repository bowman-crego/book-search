// import { error } from 'console';
import { Book, User } from '../models/index.js'
// import User from '../models/index.js'
import { signToken } from '../utils/auth.js'

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    savedBooks: typeof Book[];
}   
interface BookArgs {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
    bookData: string[];
}

// interface AddBookArgs {
//     bookId: string;
//     title: string; 
//     authors: string []; 
//     description: string; 
//     image: string; 
//     link: string; 
// }

interface UserArgs {
    username: string; 
    email: string; 
    password: string;  
}

const resolvers = {
    Query: {
    // user: async (_parent: unknown, { username }: UserArgs) => {
    //     return await User.findOne({ username }).populate('users')
    // },
    // book: async (_parent: unknown, { bookId }: BookArgs) => {
    //     return await Book.findOne({
    //         bookId: bookId
    //     })
    // },
    me: async (_parent: unknown, _args: unknown, context: any ) => {
       if(context.user) {
        const currentUser = await User.findOne({_id: context.user._id})
        return currentUser
       }
       throw new Error('Failed to authenticate')
    }
}, 

Mutation: {

    login: async (_parent: unknown, { email, password }: UserArgs) => {
        const user = await User
        .findOne({ email })
        .select('+password')
        if (!user) {
            throw new Error('Incorrect credentials')
        }
        const correctPw = await user.isCorrectPassword(password)
        if (!correctPw) {
            throw new Error('Incorrect credentials')
        }
        const token = signToken(user.username, user.email, user._id)
        return { token, user }
    },
    addUser: async (_parent: unknown, { username, email, password }: UserArgs) => {
        const user = await User.create({ username, email, password })
        const token = signToken(user.username, user.email, user._id)
        return { token, user }
    },
    saveBook: async (_parent: unknown, { bookData }: { bookData: BookArgs }, context: any) => {
        if (!context.user) {
          throw new Error('You must be logged in to save a book');
        }
    
        // Destructure bookData to ensure it's structured correctly
        const { bookId, title, authors, description, image, link } = bookData;
    
        // Create a new book object (this can be extended to save more data if needed)
        const newBook = {
          bookId,
          title,
          authors,
          description,
          image,
          link,
        };
    
        // Update the user's savedBooks array by adding the new book
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: newBook } },  // Add to savedBooks array
          { new: true }
        );
    
        return updatedUser;
      },
    // saveBook: async (_parent: unknown, { bookData }: BookArgs, context: any) => {
    //     return await User.findOneAndUpdate(
    //         { _id: context.user._id },
    //         { $addToSet: { savedBooks: bookData } },
    //         { new: true }
    //     )
    // },
    removeBook: async (_parent: unknown, { bookId }: BookArgs, context: any) => {
        return await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
        )
    },
  }
};

export default resolvers; 
