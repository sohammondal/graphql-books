const graphql=require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
 
const { GraphQLObjectType,
        GraphQLID,
        GraphQLNonNull,
        GraphQLString,
        GraphQLInt,
        GraphQLList,
        GraphQLSchema } = graphql;


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: { 
            type: AuthorType,
            resolve(parent,args){
               //return  _.find(authors,{id: parents.authorId})
               return Author.findById(parent.authorId)
            }
         }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ()=>({
        _id: { type: GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                //return _.filter(books,{authorId:parents.id})
                return Book.find({authorId:parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: {type: GraphQLNonNull(GraphQLID) }},
            resolve(parent,args){
                // code to get data from db / other source
                //return _.find(books,{id:args.id})
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: {type: GraphQLNonNull(GraphQLID)}},
            resolve(parent,args){
                //return _.find(authors,{id:args.id})
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(){
                //return books;
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                //return authors;
                return Author.find({})
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                age:  {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,{name,age}){
                let author = new Author({
                    name,
                    age
                })
                return author.save();

            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type:GraphQLNonNull(GraphQLString)},
                genre: { type: GraphQLString },
                authorId: { type:GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, {name,genre,authorId}){
                let book = new Book({
                    name,
                    genre,
                    authorId
                })
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})