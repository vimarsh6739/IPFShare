import React, { Component } from 'react';
import './App.css';
import ipfs from './ipfs';
import { Form, Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";

class App extends Component {
  state = {
    ipfsHash: null,
    buffer: '',
    filename: ''
  };

  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    this.setState({filename:file.name})
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)    
  };
  convertToBuffer = async(reader) => {
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer});
    };

  onSubmit = async (event) => {
    event.preventDefault();

    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err,ipfsHash, this.state.filename); 
        this.setState({ ipfsHash:ipfsHash[0].hash });
      })
  };

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <h1> Insert Page</h1>
          </header>
          
          <hr />
            <h3> Choose file to send to IPFS </h3>
            <Form onSubmit={this.onSubmit}>
            <input 
              type = "file"
              onChange = {this.captureFile}
            />
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Send it 
             </Button>
            </Form>
            <hr/>
         </div> 
      );
  }

}

export default App;
