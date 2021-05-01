import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import CypherSwap from '../abis/CypherSite.json';
import Token from '../abis/CypherCoin.json';
import Navbar from './Navbar';
import Main from './Main';

class App extends Component {


  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    
    this.setState({account: accounts[0]})
    console.log(this.state.account)

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance})
    console.log(this.state.ethBalance)
    
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData){
    const token = new web3.eth.Contract(Token.abi, tokenData.address)
    this.setState({token})
    let tokenBalance = await token.methods.balanceOf(this.state.account).call()
    //console.log("coin balance", coinBalance.toString())
    this.setState({tokenBalance: tokenBalance.toString()})
    //console.log(coin)
    }
    else{
      window.alert('Token contrat not deployed to detected network.')
    }




    const swapData = CypherSwap.networks[networkId]
    if(swapData){
    const cypherSite = new web3.eth.Contract(CypherSwap.abi, swapData.address)
    this.setState({ cypherSite})
    }
    else{
      window.alert('CypherSite contrat not deployed to detected network.')
    }

    console.log(this.state.cypherSite)
    this.setState({loading: false})
  }

  async loadWeb3(){

    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask.')
    }

  }

  buyTokens = (etherAmount) => {
    this.setState({loading: true}) 
    this.state.cypherSite.methods.buyTokens().send({value: etherAmount, from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  }

  constructor(props){
    super(props);
    this.state = { 
      account: '0x6faf93231a456e552dbc9961f58d9713ee4f2e69d15f1975b050ef0911053a7b', 
      token: {},
      cypherSite: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    };
  }



  render() {

    let content
    
    if(this.state.loading){
      content = <p id="loader" className="text-center">Loading...</p>
    }
    else{
      content = <Main 
      ethBalance={this.state.ethBalance} 
      tokenBalance={this.state.tokenBalance}
      buyTokens={this.buyTokens}
      />
    }

    return (
      <div>

        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
