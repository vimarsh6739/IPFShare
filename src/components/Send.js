import React, {Component} from 'react';
import {Form, Button, Spinner } from 'react-bootstrap';
import ipfs  from '../ipfs'

class Add extends Component{
  constructor(props){
    super(props);
    this.state = {
      ipfsHash : null,
      buffer: null,
      filepath: ''
    }
  }
  
  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    var filepath = '/u' + this.props.data.account + '/' + file.name
    this.setState({filepath})
    console.log(filepath)
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)    
  }

  convertToBuffer = async(reader) => {
    const buffer = await Buffer.from(reader.result);
    this.setState({buffer});
  }
  
  onSubmit = async (event) => {
    event.preventDefault();
    await ipfs.files.write(this.state.filepath, this.state.buffer, {create: true})
    const stats = await ipfs.files.stat(this.state.filepath)
    console.log(stats)
  };

  render(){
    return(<div className="AddFile">
      <h5>Add File</h5>
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

class Remove extends Component{
  render(){
    return(
      <div className="RmFile" >
        <h5>Remove File</h5>
      </div>
    );
  }
}

export class Send extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:0
    }
  }
  
  onSubmit = async (event) => {
    event.preventDefault();
    console.log(this.props.data)
    var dirName = '/u' + this.props.data.account;
    await ipfs.files.rm(dirName, { recursive: true })
    console.log('Eth account deleted:',this.props.data.account)
  }

  render(){
    return(
      <div className="Add-Remove" >
        <h3 >Add/Remove Tool</h3>
        <hr />
        <Add data={this.props.data}/>
        <br /><hr />
        <Remove data={this.props.data}/>
        <br /><hr />
        <div className="Delete">
          <h5>Remove All Data</h5>
          <Form onSubmit={this.onSubmit}>
            <Button variant="danger" bsstyle="primary" type="submit">Delete</Button>
          </Form>
          {this.state.loading ===1 && 
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          }
          {this.state.loading === 2 &&
            <div className="success-msg">
              <Form onSubmit={this.props.handle}>
                <Button bsstyle="primary" type="submit">Refresh</Button>
              </Form>
              <p>Succesfully deleted.</p>
            </div>
          }
        </div>
      </div>
    );
  }
}
