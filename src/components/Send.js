import React, {Component} from 'react';
import {Form, Button, Spinner, Table } from 'react-bootstrap';
import ipfs  from '../ipfs'

class Add extends Component{
  constructor(props){
    super(props);
    this.state = {
      ipfsHash : null,
      buffer: null,
      filepath: '',
      txnHash:null,
      blockHash:null,
      blockNum:0,
      gasUsed:0,
      txnDone:false
    }
  }
  
  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    var filepath = '/u' + this.props.data.account + '/' + file.name
    this.setState({filepath})
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
      if(!this.props.data.contract) throw "You are either using a non-ethereum browser or the contract is not deployed to this network!"
      await ipfs.files.write(this.state.filepath, this.state.buffer, {create: true})
      const dirPath = '/u'+this.props.data.account
      const stats = await ipfs.files.stat(dirPath)
      this.props.data.contract.methods.updateHash(stats.cid.toString()).send({from:this.props.data.account}).then((receipt)=>{
        this.setState({
          txnHash: receipt.transactionHash,
          blockHash: receipt.blockHash,
          blockNum: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          txnDone:true
        })
      })
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
      {this.state.txnDone &&
          <div>
            <br />
            <Table striped bordered size="sm">
              <thead>
                <tr><th>#</th><th>Value</th></tr>
              </thead>
              <tbody>
                <tr><td>Transaction hash</td><td>{this.state.txnHash}</td></tr>
                <tr><td>Block Hash</td><td>{this.state.blockHash}</td></tr>
                <tr><td>Block Number</td><td>{this.state.blockNum}</td></tr>
                <tr><td>Gas used</td><td>{this.state.gasUsed}</td></tr>
              </tbody>
            </Table>
          </div>
        }
    </div>
    );
  }
}

class Remove extends Component{

  constructor(props){
    super(props);
    this.state = {
      filename: '',
      txnHash:null,
      blockHash:null,
      blockNum:0,
      gasUsed:0,
      txnDone:false
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    var dirName = '/u' + this.props.data.account
    var filepath = dirName + '/' + this.state.filename;
    try{
      if(!this.props.data.contract) throw "You are either using a non-ethereum browser or the contract is not deployed to this network!"
      await ipfs.files.rm(filepath)
      const stats = await ipfs.files.stat(dirName)
      this.props.data.contract.methods.updateHash(stats.cid.toString()).send({from:this.props.data.account}).then((receipt)=>{
        this.setState({
          txnHash: receipt.transactionHash,
          blockHash: receipt.blockHash,
          blockNum: receipt.blockNumber,
          gasUsed: receipt.gasUsed,
          txnDone: true
        })
      })
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
        {this.state.txnDone &&
          <div>
          <br />
          <Table striped bordered size="sm">
            <thead>
              <tr><th>#</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Transaction hash</td><td>{this.state.txnHash}</td></tr>
              <tr><td>Block Hash</td><td>{this.state.blockHash}</td></tr>
              <tr><td>Block Number</td><td>{this.state.blockNum}</td></tr>
              <tr><td>Gas used</td><td>{this.state.gasUsed}</td></tr>
            </tbody>
          </Table>
          </div>
        }
      </div>
    );
  }
}

export class Send extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:0,
      txnHash:null,
      blockHash:null,
      blockNum:0,
      gasUsed:0,
    }
  }
  
  onDelete = async (event) => {
    event.preventDefault();
    this.setState({loading:1})
    try{
      if(!this.props.data.contract) throw "You are either using a non-ethereum browser or the contract is not deployed to this network!"
      var dirName = '/u' + this.props.data.account;
      await ipfs.files.rm(dirName, { recursive: true })
      //conduct a delete transaction
      this.props.data.contract.methods.deleteUser().send({from:this.props.data.account}).then((receipt) => {
        this.setState({
          txnHash: receipt.transactionHash,
          blockHash: receipt.blockHash,
          blockNum: receipt.blockNumber,
          gasUsed: receipt.gasUsed
        })
      })
      console.log('Ethereum account deleted:',this.props.data.account)
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
          <h5>Delete Account and Folder.</h5>
          <p>Note: Due to the public nature of IPFS, this doesn't mean all your files are necessarily deleted.  </p>
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
            <br />
              <Table striped bordered size="sm">
                <thead>
                  <tr><th>#</th><th>Value</th></tr>
                </thead>
                <tbody>
                  <tr><td>Transaction hash</td><td>{this.state.txnHash}</td></tr>
                  <tr><td>Block Hash</td><td>{this.state.blockHash}</td></tr>
                  <tr><td>Block Number</td><td>{this.state.blockNum}</td></tr>
                  <tr><td>Gas used</td><td>{this.state.gasUsed}</td></tr>
                </tbody>
              </Table>
          </div>
          }
        </div>
      </div>
    );
  }
}
