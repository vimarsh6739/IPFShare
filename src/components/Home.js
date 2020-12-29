import React, {Component} from 'react';
import {Form, Button, Spinner, Table} from 'react-bootstrap';
import ipfs from '../ipfs'

export class Home extends Component{

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
    
  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading:1})

    //create root folder for the current user on the chain
    try{
      if(!this.props.data.contract) throw "You are either using a non-ethereum browser or the contract is not deployed to this network!"
      var dirName = '/u' + this.props.data.account;
      await ipfs.files.mkdir(dirName)
      //Get directory hash and other stats
      console.log('Ethereum account accessed:',this.props.data.account)
      const stats = await ipfs.files.stat(dirName)
      //Add account entry
      this.props.data.contract.methods.addUser(stats.cid.toString()).send({from:this.props.data.account}).then((receipt)=>{
        this.setState({
          txnHash: receipt.transactionHash,
          blockHash: receipt.blockHash,
          blockNum: receipt.blockNumber,
          gasUsed: receipt.gasUsed
        })
      })
      this.setState({loading:2})
    } catch(err){
      window.alert(err)
    } 
  }

  async openNewTab(baseUrl){
    //Read hash from account
    this.props.data.contract.methods.readHash().call({from:this.props.data.account})
    .then(function(rootHash){
      //open in new window
      const url = baseUrl + rootHash
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
      if (newWindow) newWindow.opener = null
    })
  }

  render(){
    return(
    <div className="Home">
      <h3>Hey there, {this.props.data.account}!</h3>
      {this.props.data.isAuth &&
        <div className="user-recognized">
          Welcome. To view your folder, go to this <br />
          <Button variant="link" onClick={() => this.openNewTab('https://ipfs.io/ipfs/')}>
            link
          </Button>
        </div>
      }
      {!this.props.data.isAuth &&
        <div className="new-user">
          <p>It seems that you don't have a shared account with our service.</p>
          <p>Register below to create an account. This is compulsory in order to work with your remote files, as well as other files on the shared network. </p>
          <p>Creating an account will make a new directory specific to your wallet address</p>
          <Form onSubmit={this.onSubmit}>
            <Button bsstyle="primary" type="submit">Create Account</Button>
          </Form>
          <p>(Note: you will be charged ETH for this transaction)</p>
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
              </Form> <br />
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
      }
    </div>);
  }
}