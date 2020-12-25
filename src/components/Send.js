import React, {Component} from 'react';
import {Form, Button } from 'react-bootstrap';
import ipfs  from '../ipfs'

export class Send extends Component{
    constructor(props){
        super(props);
        this.state = {
            ipfsHash : null,
            buffer: null,
            filename: ''
        }
    }

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

      render(){
          return(
              <div>
                  <h3> Choose file to send to IPFS</h3>

                  <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                    <input type = "file" onChange = {this.captureFile} />
                    </Form.Group>
                    <Button bsstyle="primary" type="submit"> Upload </Button>
                  </Form>
                  
                </div>
          );
      }
}
