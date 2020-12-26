import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import './App.css';
import Web3 from 'web3';
import {Header} from './components/Header'
import {Send} from './components/Send'
import {Home} from './components/Home'
import {Search} from './components/Search'
class App extends Component {

  async componentDidMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.isAuthenticated();
  }


  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      window.ethereum.autoRefreshOnNetworkChange = false
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

  async isAuthenticated(){
    //query contract and set state
    this.setState({isAuth: false})
  }

  constructor(props){
    super(props);
    this.state = {
      account: '0xQuixoticDoppleganger', // current account retreived from metamask
      contract: null, // current abi in use
      isAuth: false, // is the current user present in our blockchain??
    };
    this.setAuthTrue = this.setAuthTrue.bind(this);
    this.setAuthFalse = this.setAuthFalse.bind(this);
  }

  setAuthTrue(){this.setState({isAuth: true})}
  setAuthFalse(){this.setState({isAuth: false})}

  render() {
    return (
        <div className="App">
          <Header account={this.state.account}/>
          <Switch>
            <Route exact path="/" 
              render={(props) => 
                (<Home {...props} 
                  data={this.state}
                  handle={this.setAuthTrue}
                />)} 
            />
            <Route exact path="/send"  
              render={(props) => 
                (<Send {...props} 
                  data={this.state}
                  handle={this.setAuthFalse}
                />)}
            />
            <Route exact path="/search" 
              render={(props) =>
                (<Search {...props}
                  data={this.state} 
                />)} 
            />
            <Route render={() => <p>Page not found!</p>} />
          </Switch>
        </div> 
    );
  }
}

export default App;
