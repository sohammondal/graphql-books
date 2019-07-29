import React, { Component  } from "react";
import { graphql } from 'react-apollo';

import { getAllBooks } from '../queries/queries';

import BookDetails from './BookDetails';

class BookList extends Component { 
    
    constructor(props){
        super(props)
        this.state = {
            selected:""
        }
    }

    renderBooks(){
        let data = this.props.data;
        if(data.loading){
            return <div>Loading.....</div>
        }else{
            return data.books.map(({_id,name})=>{
                return(
                        <li onClick={e=>this.setState({selected:_id})} key={_id}>{name}</li>
                )
            })
                    
            
        }
    }

    render(){
        
        return(
        <div>
            <BookDetails bookId={this.state.selected}/>
             <ul id="book-list">
                {this.renderBooks()}
            </ul>
        </div>)
    }
}

export default graphql(getAllBooks)(BookList);