const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");
const Reader = require("../models/reader");
const log = console.log;

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      }
    },
    readers: {
      type: new GraphQLList(ReaderType),
      resolve(parent, args) {
        let readers = [];
        if (parent.readerList && parent.readerList.length > 0) {
          for (_id of parent.readerList) {
            readers.push(Reader.findById(_id));
          }
        }
        return readers;
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

const ReaderType = new GraphQLObjectType({
  name: "Reader",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        let books = [];
        for (_id of parent.bookList) {
          // books.push(_.find(_books, { _id: id }));
          books.push(Book.findById(_id));
        }
        return books;
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        //console.log(args);
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    },
    reader: {
      type: ReaderType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Reader.findById(args.id);
      }
    },
    readers: {
      type: new GraphQLList(ReaderType),
      resolve(parent, args) {
        return Reader.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, { name, age }, context) {
        let auth = context.headers["x-api-token"];
        if (auth && auth === process.env.TOKEN) {
          let author = new Author({
            name,
            age
          });
          return author.save();
        }
        throw new Error("401 Unauthorized: x-api-token Missin");
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, { name, genre, authorId }, context) {
        let auth = context.headers["x-api-token"];
        if (auth && auth === process.env.TOKEN) {
          let book = new Book({
            name,
            genre,
            authorId
          });
          return book.save();
        }
        throw new Error("401 Unauthorized: x-api-token Missin");
      }
    },
    addReader: {
      type: ReaderType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let reader = new Reader({
          name: args.name,
          bookList: []
        });
        return reader.save();
      }
    },
    addBookToRedersBookList: {
      type: ReaderType,
      args: {
        readerId: { type: GraphQLNonNull(GraphQLID) },
        bookId: { type: GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, { readerId, bookId }) {
        try {
          await Book.findByIdAndUpdate(bookId, {
            $push: { readerList: readerId }
          }).exec();
          return Reader.findByIdAndUpdate(
            readerId,
            {
              $push: { bookList: bookId }
            },
            {
              upsert: true,
              new: true
            }
          );
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
