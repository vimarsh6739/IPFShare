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
    try{
      await ipfs.files.write(this.state.filepath, this.state.buffer, {create: true})
      const stats = await ipfs.files.stat(this.state.filepath)
      console.log(stats)
    } catch(err){
      window.alert(err)
    }
  };

  render(){
    return(<div className="AddFile" style={{textAlign:'left'}}>
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

  constructor(props){
    super(props);
    this.state = {
      filename: ''
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    // console.log('Recorded filename::', this.state.filename)
    var filepath = '/u' + this.props.data.account + '/' + this.state.filename;
    try{
      await ipfs.files.rm(filepath)
      console.log('Deleted file', filepath)
    } catch(err){
      window.alert(err)
    }
  }
  render(){
    return(
      <div className="RmFile" style={{textAlign:'left'}}>
        <h5>Remove File</h5>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="formBasicText">
            <Form.Label>File name</Form.Label>
            <Form.Control
              className="textFeedback"
              as="input"
              rows="3"
              placeholder="myfilename.txt"
              value={this.state.filename}
              onChange={e => this.setState({ filename: e.target.value })}
              type="text"
            />            
            <Form.Text className="text-muted">
              This file will be deleted from your ipfs folder.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
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
  
  onDelete = async (event) => {
    event.preventDefault();
    this.setState({loading:1})
    try{
      console.log(this.props.data)
      var dirName = '/u' + this.props.data.account;
      await ipfs.files.rm(dirName, { recursive: true })
      console.log('Eth account deleted:',this.props.data.account)
    } catch(err){
      window.alert(err)
    } finally{
      this.setState({loading:2})
    }
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
        <div className="Delete" style={{textAlign:'left'}}>
          <h5>Remove All Data</h5>
          <Form onSubmit={this.onDelete}>
            <Button variant="danger" bsstyle="primary" type="submit">Delete</Button>
          </Form>
          <br />
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
            <p>Data succesfully deleted</p>
          </div>
          }
        </div>
      </div>
    );
  }
}
