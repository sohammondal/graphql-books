import { gql } from 'apollo-boost';

const getAllBooks =gql`
    query GetAllBooks{
        books{
        _id
        name
        }
    }
`
const GetBookByID =gql`
    query GetBookByID($id:ID!){
        book(id:$id){
        _id
        name
        genre
        author{
            _id
            name
            age
            books{
                    name
                    _id
            }
        }
    }
}
`

const getAllAuthors =gql`
    query GetAllAuthors{
        authors{
        _id,
        name,
        }
    }
`

const addABook=gql`
    mutation AddABook($name:String!,$genre:String!,$authorId:ID!){
        addBook(name:$name,genre:$genre,authorId:$authorId){
            _id
            name
        }
    }
`

export { getAllBooks,getAllAuthors,addABook,GetBookByID }