import React, { Component  } from "react";
import { graphql } from 'react-apollo';

import { GetBookByID } from '../queries/queries';

class BookDetails extends Component { 

    renderBookDetails(){
       let { book } = this.props.data;
       if(book){
           return(
               <div>
                   <h2>{book.name}</h2>
                    <p>GENRE: {book.genre}</p>
                    <p>AUTHOR: {book.author.name}</p>
                   <p>All Books By Author:</p>
                   <ul className="other-books">
                       {book.author.books.map(item=>{
                           return <li key={item._id}> {item.name} </li>
                       })}
                   </ul>
               </div>
           )
       }
       return <div>No Books Selected</div>
    }

    render(){
        //console.log(this.props);
        return(
        <div id="book-details">
            {this.renderBookDetails()}
        </div>
        )
    }
}

export default graphql(GetBookByID,{
    options: (props) => {
        return {
            variables: {
                id: props.bookId
            }
        }
    }
})(BookDetails);