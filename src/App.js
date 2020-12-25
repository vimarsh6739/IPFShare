import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import './App.css';
import Web3 from 'web3';
import {Header} from './components/Header'
import {Send} from './components/Send'
import {Home} from './components/Home'

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
  }


  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      console.log('Accessed ethereum')
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
      console.log('Accessed current provider')
    }
    else{
      window.alert('Non-ethereum browser detected. Install metamask!!')
    }
  }

  async loadBlockchainData(){
    // Load account
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({account: accounts[0]})

    //Load contract abi - to be implemented
  }

  constructor(props){
    super(props);
    this.state = {
      account: 'default', // current account retreived from metamask
      contract: null // current abi in use
    };
  }

  render() {
    return (
        <div className="App">
          <Header user={this.state.account}/>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/send" component={Send} />
          </Switch>
        </div> 
    );
  }
}

export default App;
