import React, { Component  } from "react";
import { graphql,compose } from 'react-apollo';

import { getAllAuthors,addABook,getAllBooks } from '../queries/queries';

class AddBook extends Component { 

    constructor(props){
        super(props)
        this.state = {
            name: '',
            genre: '',
            authorId: ''
        }
    }

    displayAuthors(){
        let data = this.props.getAllAuthors;
        if(data.loading){
            return <option disabled>Loading Authors.....</option>
        }else{
            return data.authors.map(({_id,name})=>{
                return <option key={_id} value={_id}>{name}</option>
            })
        }

    }

    onSubmitHandler(e){
        e.preventDefault()
        let { name,genre,authorId} = this.state;
        this.props.addABook({
            variables:{
                name,
                genre,
                authorId
            },
            refetchQueries: [{query:getAllBooks }]
        }).catch(err=>console.log(err.message))
    }

    render(){
        
        return(
            <form onSubmit={this.onSubmitHandler.bind(this)} id="add-book">
                <div className="field">
                    <label>Book name:</label>
                    <input type="text" onChange={e=>this.setState({name:e.target.value})}/>
                </div>
                <div className="field">
                    <label>Genre:</label>
                    <input type="text" onChange={e=>this.setState({genre:e.target.value})}/>
                </div>
                <div className="field">
                    <label>Author:</label>
                    <select onChange={e=>this.setState({authorId:e.target.value})}>
                        <option>Select author</option>
                        { this.displayAuthors() }
                    </select>
                </div>
                <button>+</button>
            </form>)
    }
    }


export default compose(
    graphql(getAllAuthors,{name:"getAllAuthors"}),
    graphql(addABook,{name:"addABook"})
)(AddBook);
