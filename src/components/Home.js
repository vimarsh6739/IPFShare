import React, {Component} from 'react';
import {Form, Button, Spinner} from 'react-bootstrap';
import ipfs from '../ipfs'

export class Home extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:0
    }
  }
    
  onSubmit = async (event) => {
    event.preventDefault();
    //create account through blockchain txn
    //and a root folder for the current user on the chain
    this.setState({loading:1})
    console.log(this.props.data)
    try{
      var dirName = '/u' + this.props.data.account;
      await ipfs.files.mkdir(dirName)
      //Get directory hash and other stats
      console.log('Eth account:',this.props.data.account)
      const stats = await ipfs.files.stat(dirName)
      console.log('Ipfs dir stats:',stats)
    } catch(err){
      window.alert(err)
    } finally {
      this.setState({loading:2})
    }

  }

  render(){
    return(
    <div className="Home">
      <h3>Hey there, {this.props.data.account}!</h3>
      {this.props.data.isAuth &&
        <div className="usr-recognized">
          Welcome. To view your folder, go to this <a href="http://167.71.227.116:8080/ipfs/QmeBUSeuMJm721hAE5xSkfp2tHGx1zyEdRM1sLLvXz4Dmd" target="_blank" rel="noreferrer">link</a>
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
              </Form>
              <p>Transaction succeded. Click to refresh.(Print etherscan ref.)</p>
            </div>
          }
        </div>
      }
    </div>);
  }
}