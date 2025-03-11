import { Book, User } from '../models/index.js'
import { signToken } from '../utils/auth.js'

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    savedBooks: Book[];
}   
interface BookArgs {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
}

interface AddBookArgs {
    bookId: string;
    title: string; 
    authors: string []; 
    description: string; 
    image: string; 
    link: string; 
}

interface UserArgs {
    username: string; 
    email: string; 
    password: string;  
}

const resolvers = {
    Query: {
    user: async (_parent: unknown, { username }: UserArgs) => {
        return await User.findOne({ username }).populate('users')
    },
    book: async (_parent: unknown, { bookId }: BookArgs) => {
        return await Book.findOne({
            bookId: bookId
        })
    },
    me: async () => {
        return await User.find().populate('users')
    }
}, 

Mutation: {
    AddBook: async (_parent: unknown, { bookId, title, authors, description, image, link } : AddBookArgs) => {
        const book = await Book.create({ bookId, title, authors, description, image, link })
        return book; 
    },
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
        const token = signToken(user)
        return { token, user }
    },
    addUser: async (_parent: unknown, { username, email, password }: UserArgs) => {
        const user = await User.create({ username, email, password })
        const token = signToken(user)
        return { token, user }
    },
    saveBook: async (_parent: unknown, { bookData }: BookArgs) => {
        return await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: bookData } },
            { new: true }
        )
    },
    removeBook: async (_parent: unknown, { bookId }: BookArgs) => {
        return await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
        )
    },
  }
};

export default resolvers; 
