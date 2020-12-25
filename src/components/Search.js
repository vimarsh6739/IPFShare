import React, {Component} from 'react';
import {Form, Button } from 'react-bootstrap';
const getEditDistance = function(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
  
    var matrix = [];
  
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }
  
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }
  
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }
  
    return matrix[b.length][a.length];
  };
export class Search extends Component{
    constructor(props){
        super(props);
        this.state = {
            text: null,
            result:null,
            keyval: {'book1':'hash1','book4':'hash4','book3':'hash3','book2':'hash2'}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({text: event.target.value});
        
    }
    handleSubmit(event) {
     
        this.setState({result:this.state.text},function(){console.log(getEditDistance(this.state.text,"BOOK"))});
        event.preventDefault();
      }
    render(){
        return(
            <div >
                <div class="searchBar" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group style={{display:'inline-block'}}>
                            <Form.Control type="text" value={this.state.text} onChange={this.handleChange} placeholder="Search" />
                        </Form.Group>
                        <div style={{display:'inline-block'}}>
                            <Button variant="primary" type="submit" on>
                                Search
                            </Button>
                        </div>
                    </Form>
                </div>
                <div>
                    {this.state.result}
                </div>
            </div>
            
        );
    }
}